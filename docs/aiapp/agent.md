---
title: Agent 智能体
order: 7
---
Agent 和普通的"调用模型回答问题"有本质区别：Agent 能自主规划步骤、调用工具、观察结果、调整策略，持续执行直到完成复杂任务

### 1 Agent 是什么？
普通 LLM 调用是单次问答：一问一答，结束。
Agent 是一个持续执行的循环
```md
用户任务
    ↓
模型分析：我需要做什么？先做哪步？
    ↓
调用工具（搜索/执行代码/查数据库）
    ↓
观察工具结果
    ↓
模型判断：任务完成了吗？还需要什么？
    ↓ (如果未完成)
继续调用工具...
    ↓ (完成)
给出最终回答
```
#### 1.1 Agent vs Function Call
- `Function Call`：模型决定调哪个工具、传什么参数，代码执行，返回结果给模型
- `Agent`：在 `Function Call` 的基础上，加了循环——工具执行完可以继续调工具，直到任务完成
`Agent` = `Function Call` + 循环 + 自主规划

### 2 Agent 实现
#### 2.1 工具调用
```js
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

const searchTool = tool(
  async ({ query }) => {
    // 实际接搜索 API，这里用模拟数据
    const results = await searchAPI(query)
    return JSON.stringify(results)
  },
  {
    name: 'search',
    // description 决定模型什么时候调这个工具
    description: '搜索技术文档和资讯。查找技术信息、版本更新、最佳实践时使用。',
    schema: z.object({
      query: z.string().describe('搜索关键词'),
    }),
  }
)

const runCodeTool = tool(
  async ({ code }) => {
    try {
      // 沙箱执行（生产环境用 vm2 或 Docker 容器）
      const result = await sandbox.run(code)
      return JSON.stringify({ success: true, output: result })
    } catch (e) {
      return JSON.stringify({ success: false, error: e.message })
    }
  },
  {
    name: 'run_code',
    description: '执行 JavaScript 代码并返回结果，适合验证逻辑、计算数值。',
    schema: z.object({
      code: z.string().describe('要执行的 JavaScript 代码'),
    }),
  }
)
```
### 2.2 构建 ReAct Agent 图
LangGraph 的 Agent 本质上是一个 agent → tools → agent 的循环图：
```js
import { StateGraph, END, START, Annotation, messagesStateReducer } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const tools = [searchTool, runCodeTool, readFileTool]
const toolNode = new ToolNode(tools)

const State = Annotation.Root({
  messages: Annotation({ reducer: messagesStateReducer, default: () => [] }),
  steps:    Annotation({ reducer: (_, n) => n, default: () => 0 }),
})

async function agentNode(state) {
  const response = await model.bindTools(tools).invoke([
    new SystemMessage(`你是前端开发助手。
可用工具：search（搜索文档）、run_code（执行代码）、read_file（读文件）
工作方式：分析需求 → 按需调用工具 → 综合结果回答
每次工具调用后，判断是否需要继续调用其他工具。`),
    ...state.messages,
  ])
  return { messages: [response], steps: state.steps + 1 }
}

function routeAgent(state) {
  const last = state.messages[state.messages.length - 1]
  // 防止无限循环：超过最大步数强制结束
  if (state.steps >= 10) return '__end__'
  return last.tool_calls?.length ? 'tools' : '__end__'
}

const agent = new StateGraph(State)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', routeAgent, {
    tools: 'tools',
    __end__: END,
  })
  .addEdge('tools', 'agent')  // 工具执行完，回到 agent 继续思考
  .compile()

// 运行
const result = await agent.invoke({
  messages: [new HumanMessage('查一下 Vue3 最新版本，看看我的 package.json 里用的是哪个版本')],
  steps: 0,
})
```
### 2.3 执行过程示例
```md
用户：查一下 Vue3 最新版本，看看项目里用的哪个版本，要不要升级

Step 1 - 模型思考：需要两个信息：1) Vue3 最新版 2) 项目当前版本
→ 调用 search("Vue3 最新版本")
→ 结果：Vue 3.4.21

Step 2 - 模型思考：还需要看 package.json
→ 调用 read_file("package.json")
→ 结果：{ dependencies: { vue: "^3.3.0" } }

Step 3 - 模型思考：信息够了，可以回答
→ 不调工具，生成最终回答

最终回答：Vue3 最新版是 3.4.21，您的项目用的是 ^3.3.0（锁定 3.3.x）。
建议升级到 3.4.x，主要改进包括：defineModel 正式稳定、性能提升。
升级命令：npm update vue
```
### 2.4 自我反思（Reflection）
```js
// 节点：评估回答质量
async function reflectNode(state) {
  const lastAnswer = state.messages
    .filter(m => m._getType() === 'ai')
    .slice(-1)[0]?.content ?? ''

  const question = state.messages[0].content

  // 用结构化输出做质量评估
  const reflectModel = model.withStructuredOutput(z.object({
    satisfactory: z.boolean().describe('回答是否完整准确'),
    issues: z.array(z.string()).describe('不满意的具体原因'),
    suggestion: z.string().describe('改进建议'),
  }))

  const reflection = await reflectModel.invoke([
    new SystemMessage('你是质量审核员，评估 AI 回答是否完整、准确、满足用户需求。'),
    new HumanMessage(`问题：${question}\n\nAI 回答：${lastAnswer}`),
  ])

  return {
    reflections: [reflection],
    satisfactory: reflection.satisfactory,
    retryCount: state.retryCount + (reflection.satisfactory ? 0 : 1),
  }
}

// 节点：根据反思意见修改回答
async function reviseNode(state) {
  const lastReflection = state.reflections[state.reflections.length - 1]

  return model.bindTools(tools).invoke([
    new SystemMessage('你是前端助手，根据改进建议重新回答。'),
    ...state.messages,
    new HumanMessage(
      `上一个回答存在问题：${lastReflection.issues.join('；')}\n改进建议：${lastReflection.suggestion}\n请改进后重新回答。`
    ),
  ])
}

// 路由：满意则结束，不满意且未超次数则重试
function routeAfterReflect(state) {
  if (state.satisfactory) return 'end'
  if (state.retryCount >= 2) return 'end'   // 最多重试 2 次
  return 'revise'
}

const agentWithReflect = new StateGraph(State)
  .addNode('agent',   agentNode)
  .addNode('tools',   toolNode)
  .addNode('reflect', reflectNode)
  .addNode('revise',  reviseNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', routeAfterAgent, { tools: 'tools', reflect: 'reflect' })
  .addEdge('tools', 'agent')
  .addConditionalEdges('reflect', routeAfterReflect, { end: END, revise: 'revise' })
  .addEdge('revise', 'reflect')
  .compile()
```
反思的适用场景：代码生成（验证代码是否可运行）、信息整理（检查信息是否完整）、文案写作（检查语言是否符合要求）。
不适合的场景：简单问答（过度优化，增加成本和延迟）、实时交互（用户在等待，反思会明显拖慢响应速度）。

### 3 多 Agent 协作（Supervisor 模式）
复杂任务拆分给专职 Agent，由 Supervisor 统筹调度
```md
用户：开发一个 UserCard 组件，需要代码、测试和文档

Supervisor：
  → 分配给代码 Agent：生成组件代码
  → 分配给测试 Agent：基于代码生成单元测试
  → 分配给文档 Agent：生成使用文档
  → FINISH：所有任务完成
```
```js
// Supervisor：决定下一步分配给谁
const RouteSchema = z.object({
  nextAgent: z.enum(['code_agent', 'test_agent', 'doc_agent', 'FINISH']),
  reason: z.string(),
  instruction: z.string().describe('给下一个 Agent 的具体指令'),
})

async function supervisorNode(state) {
  const routeModel = model.withStructuredOutput(RouteSchema)

  const completed = Object.keys(state.results).join(', ') || '无'

  const response = await routeModel.invoke([
    new SystemMessage(`你是任务调度器。
可用 Agent：
- code_agent：生成组件代码
- test_agent：生成单元测试（需要先有代码）
- doc_agent：生成文档（需要先有代码）
- FINISH：所有任务已完成

当前任务：${state.task}
已完成：${completed}`),
    new HumanMessage('请决定下一步'),
  ])

  return {
    nextAgent: response.nextAgent,
    completed: response.nextAgent === 'FINISH',
  }
}

// 路由：根据 Supervisor 的决定跳转到对应 Agent
function routeFromSupervisor(state) {
  if (state.completed) return 'end'
  const map = { code_agent: 'code_agent', test_agent: 'test_agent', doc_agent: 'doc_agent', FINISH: 'end' }
  return map[state.nextAgent] ?? 'end'
}

const multiAgentGraph = new StateGraph(State)
  .addNode('supervisor', supervisorNode)
  .addNode('code_agent',  codeAgentNode)
  .addNode('test_agent',  testAgentNode)
  .addNode('doc_agent',   docAgentNode)
  .addEdge(START, 'supervisor')
  .addConditionalEdges('supervisor', routeFromSupervisor, {
    code_agent: 'code_agent',
    test_agent: 'test_agent',
    doc_agent:  'doc_agent',
    end: END,
  })
  // 每个 Agent 完成后都回到 Supervisor
  .addEdge('code_agent', 'supervisor')
  .addEdge('test_agent', 'supervisor')
  .addEdge('doc_agent',  'supervisor')
  .compile()
```
什么时候用多 Agent

适合用：
- 任务可以明确拆分为独立的子任务
- 不同子任务需要不同的工具或专业知识
- 任务之间有依赖关系（先写代码，再写测试）

不适合用：
- 简单的单步任务（过度设计）
- 子任务之间耦合太紧，信息传递复杂

### 4 流式推送执行步骤
前端要实时看到 `Agent` 的思考过程，用 `streamEvents` 推送每一步的状态
```js
// 服务端
app.post('/api/agent/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

  for await (const event of agentGraph.streamEvents(
    { messages: [new HumanMessage(req.body.message)], steps: 0 },
    { version: 'v2' }
  )) {
    // 工具开始执行
    if (event.event === 'on_tool_start') {
      send('tool_start', {
        name: event.name,
        args: event.data?.input,
      })
    }
    // 工具执行完毕
    if (event.event === 'on_tool_end') {
      send('tool_end', {
        name: event.name,
        result: event.data?.output,
      })
    }
    // 模型流式输出 token
    if (event.event === 'on_chat_model_stream' && event.data?.chunk?.content) {
      send('token', { token: event.data.chunk.content })
    }
  }

  send('done', {})
  res.end()
})
```
Vue3 前端接收步骤状态
```js
const currentSteps = ref([])  // 当前执行中的步骤
const activeSteps = {}         // toolName → step 对象（用于更新状态）

// 处理 SSE 事件
if (event === 'tool_start') {
  const step = {
    name: data.name,
    args: data.args,
    status: 'running',
    startTime: Date.now(),
    result: null,
    duration: null,
  }
  activeSteps[data.name] = step
  currentSteps.value = [...currentSteps.value, step]
}

if (event === 'tool_end') {
  const step = activeSteps[data.name]
  if (step) {
    step.result = data.result
    step.status = 'done'
    step.duration = Date.now() - step.startTime
    // 触发视图更新
    currentSteps.value = [...currentSteps.value]
  }
}
```
### 5 工作流
#### 5.1线性工作流
#### 5.2条件工作流
#### 5.3并行工作流
多个节点同时执行，等全部完成后再汇聚。
##### 5.3.1 `RunnableParallel`（无状态并行，代码最简洁）

    ```js
        import { RunnableParallel } from '@langchain/core/runnables'

        const makeAnalyzer = (role, focus) =>
        ChatPromptTemplate.fromMessages([
            ['system', `你是${role}专家，分析${focus}问题，回答100字内。`],
            ['human', '项目：{info}'],
        ]).pipe(model).pipe(new StringOutputParser())

        // 4 个分析器同时执行
        const result = await RunnableParallel.from({
        performance:   makeAnalyzer('性能', '加载速度'),
        accessibility: makeAnalyzer('可访问性', 'WCAG'),
        seo:           makeAnalyzer('SEO', '搜索优化'),
        security:      makeAnalyzer('安全', '前端漏洞'),
        }).invoke({ info: projectDescription })

        // result.performance / result.accessibility / result.seo / result.security
        // 总耗时 ≈ max(各任务耗时)，而非各任务之和
    ```
##### 5.3.2 `LangGraph` 并行节点

    ```js
        // 关键：从同一个前置节点（或 START）连到多个节点，这些节点会并行执行
        // 多个节点连到同一个后续节点，该节点等待所有前置节点完成后才执行

        const State = Annotation.Root({
        input:       Annotation({ reducer: (_, n) => n, default: () => '' }),
        perfResult:  Annotation({ reducer: (_, n) => n, default: () => '' }),
        a11yResult:  Annotation({ reducer: (_, n) => n, default: () => '' }),
        seoResult:   Annotation({ reducer: (_, n) => n, default: () => '' }),
        finalReport: Annotation({ reducer: (_, n) => n, default: () => '' }),
        })

        const parallelWorkflow = new StateGraph(State)
        .addNode('perf',  perfNode)
        .addNode('a11y',  a11yNode)
        .addNode('seo',   seoNode)
        .addNode('merge', mergeNode)  // 汇聚节点
        .addEdge(START, 'perf')       // 三个节点同时从 START 启动
        .addEdge(START, 'a11y')
        .addEdge(START, 'seo')
        .addEdge('perf',  'merge')    // 三个节点都连向 merge
        .addEdge('a11y',  'merge')    // merge 等待三个全部完成
        .addEdge('seo',   'merge')
        .addEdge('merge',  END)
        .compile()
    ```

#### 5.4 Human-in-the-Loop（人工干预）
在关键节点暂停工作流，等待人工审核或修改，然后继续。
##### 5.4.1 配置中断点
配置中断点，指定在哪个节点暂停。
```js
import { MemorySaver } from '@langchain/langgraph'

const checkpointer = new MemorySaver()  // 生产环境换 PostgresSaver 或 RedisSaver

const workflow = new StateGraph(State)
  .addNode('generate_draft', generateDraftNode)
  .addNode('human_review',   humanReviewNode)   // 中断点
  .addNode('revise',         reviseNode)
  .addNode('publish',        publishNode)
  // ...边定义...
  .compile({
    checkpointer,
    interruptBefore: ['human_review'],  // 在该节点执行前暂停
    // 或 interruptAfter: ['generate_draft']  // 在该节点执行后暂停
  })
```
##### 5.4.2 完整的中断-恢复流程
```js
const config = { configurable: { thread_id: 'publish_001' } }

// 第一次运行：执行到 human_review 前自动暂停
await workflow.invoke({ topic: 'Vue3 新特性' }, config)

// 检查暂停位置
const state = await workflow.getState(config)
console.log(state.next)   // ['human_review'] — 工作流停在这里

// 此时可以读取草稿内容给审核人员
console.log(state.values.draft)

// 人工审核完成，注入反馈（可以来自 HTTP 请求、消息队列等）
await workflow.updateState(config, {
  humanFeedback: '代码示例换成 TypeScript，补充实际业务场景',
})

// 继续执行（传 null 表示从上次中断处继续，不改变输入）
const finalResult = await workflow.invoke(null, config)
console.log('已发布：', finalResult.published)
```