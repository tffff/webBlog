---
title: Langchain
order: 4
---
### 1.1 为什么需要 Langgraph？
第一章直接用 `fetch` 调用 `API` 没问题，但项目一复杂就会遇到几个痛点：
- 复杂的条件分支逻辑写起来乱

### 1.2 LangGraph 核心概念
把 AI 流程建模成有向图：
- 节点（Node）：执行具体工作的函数（调用模型、查数据库、调用 API）
- 边（Edge）：节点之间的连接，决定执行顺序
- 状态（State）：贯穿整个图的共享数据，每个节点读取并更新
- 条件边（Conditional Edge）：根据当前状态动态决定走哪个节点

### 1.2.1 StateGraph 基础
```js
import { StateGraph, END, START, Annotation, messagesStateReducer } from '@langchain/langgraph'

// 第一步：定义状态结构
const GraphState = Annotation.Root({
  // messages 使用内置 reducer：新消息追加到数组末尾
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  // 替换型：每次更新直接覆盖旧值
  intent: Annotation({
    reducer: (_, newVal) => newVal,
    default: () => '',
  }),
  // 累加型：自定义 reducer，新值追加到数组
  logs: Annotation({
    reducer: (existing, newVal) => [...existing, ...newVal],
    default: () => [],
  }),
})

// 第二步：定义节点函数
// 接收完整的 state，返回需要更新的字段（只写变化的，不变的不用写）
async function chatNode(state) {
  const res = await model.invoke([
    new SystemMessage('你是前端助手'),
    ...state.messages,
  ])
  return { messages: [res] } // messages reducer 会把 res 追加进去
}

// 第三步：构建图
const graph = new StateGraph(GraphState)
  .addNode('chat', chatNode)
  .addEdge(START, 'chat')
  .addEdge('chat', END)
  .compile()

// 第四步：运行
const result = await graph.invoke({
  messages: [new HumanMessage('Vue3 的 Teleport 是什么？')],
})

const lastMsg = result.messages[result.messages.length - 1]
console.log(lastMsg.content)
```
#### 1.2.2 多节点顺序图
把复杂任务拆成多个节点，每个节点专注一件事
```js
//链路 START->analyze->solution->code->END
const State = Annotation.Root({
  userInput:   Annotation({ reducer: (_, n) => n, default: () => '' }),
  analysis:    Annotation({ reducer: (_, n) => n, default: () => '' }),
  solution:    Annotation({ reducer: (_, n) => n, default: () => '' }),
  codeExample: Annotation({ reducer: (_, n) => n, default: () => '' }),
})

// 节点1：分析问题类型
async function analyzeNode(state) {
  const res = await model.invoke([
    new SystemMessage('判断问题类型（性能/逻辑/语法/架构），一句话输出。'),
    new HumanMessage(state.userInput),
  ])
  return { analysis: res.content }
}

// 节点2：给出解决思路
async function solutionNode(state) {
  const res = await model.invoke([
    new SystemMessage('给出简洁解决思路，不超过 3 步。'),
    new HumanMessage(`问题：${state.userInput}\n类型：${state.analysis}`),
  ])
  return { solution: res.content }
}

// 节点3：生成代码示例
async function codeNode(state) {
  const res = await model.invoke([
    new SystemMessage('根据解决方案写代码示例，15行以内。'),
    new HumanMessage(state.solution),
  ])
  return { codeExample: res.content }
}

const graph = new StateGraph(State)
  .addNode('analyze',  analyzeNode)
  .addNode('solution', solutionNode)
  .addNode('code',     codeNode)
  .addEdge(START,      'analyze')
  .addEdge('analyze',  'solution')
  .addEdge('solution', 'code')
  .addEdge('code',      END)
  .compile()

const result = await graph.invoke({
  userInput: 'Vue3 列表渲染 1000 条数据时页面卡顿',
})
```

#### 1.2.3 条件路由：动态决定流程
条件路由是 LangGraph 最核心的特性——让 AI 自己决定流程走向
```js
// 链路 START->classify->code_help/concept/resource->END
import { z } from 'zod'

const State = Annotation.Root({
  messages:     Annotation({ reducer: messagesStateReducer, default: () => [] }),
  questionType: Annotation({ reducer: (_, n) => n, default: () => '' }),
  answer:       Annotation({ reducer: (_, n) => n, default: () => '' }),
})

// 意图分类节点
const ClassifySchema = z.object({
  type: z.enum(['code_help', 'concept', 'resource']),
})

async function classifyNode(state) {
  const lastMsg = state.messages[state.messages.length - 1]
  const classifyModel = model.withStructuredOutput(ClassifySchema)

  const result = await classifyModel.invoke([
    new SystemMessage(`判断前端问题的类型：
- code_help：需要写/调试代码
- concept：解释概念或原理
- resource：推荐学习资料`),
    new HumanMessage(lastMsg.content),
  ])

  return { questionType: result.type }
}

// 三个处理节点，各有专注方向
async function codeHelpNode(state) { /* 生成代码解决方案 */ }
async function conceptNode(state)  { /* 解释概念，举例子 */ }
async function resourceNode(state) { /* 推荐学习资源 */ }

// 路由函数：根据 state 返回下一个节点的名称
function routeQuestion(state) {
  const map = { code_help: 'code_help', concept: 'concept', resource: 'resource' }
  return map[state.questionType] ?? 'concept'
}

const graph = new StateGraph(State)
  .addNode('classify',  classifyNode)
  .addNode('code_help', codeHelpNode)
  .addNode('concept',   conceptNode)
  .addNode('resource',  resourceNode)
  .addEdge(START, 'classify')
  // addConditionalEdges：classify 执行完后调用 routeQuestion，根据返回值跳转
  .addConditionalEdges('classify', routeQuestion, {
    code_help: 'code_help',
    concept:   'concept',
    resource:  'resource',
  })
  .addEdge('code_help', END)
  .addEdge('concept',   END)
  .addEdge('resource',  END)
  .compile()

// 测试
const r = await graph.invoke({
  messages: [new HumanMessage('Vue3 中 v-for 和 v-if 同时使用时哪个优先级更高？')],
})
console.log('路由到：', r.questionType) // 'concept'
console.log('回答：',   r.answer)
```

#### 1.2.4 带循环的图：生成 → 检查 → 修正
```js
const ReviewState = Annotation.Root({
  requirement: Annotation({ reducer: (_, n) => n, default: () => '' }),
  code:        Annotation({ reducer: (_, n) => n, default: () => '' }),
  review:      Annotation({ reducer: (_, n) => n, default: () => '' }),
  attempts:    Annotation({ reducer: (_, n) => n, default: () => 0 }),
  passed:      Annotation({ reducer: (_, n) => n, default: () => false }),
})

async function generateCodeNode(state) {
  const res = await model.invoke([
    new SystemMessage('你是 Vue3 工程师，生成符合要求的组件代码。'),
    new HumanMessage(`需求：${state.requirement}
${state.review ? `上次审查问题：${state.review}，请修正。` : ''}`),
  ])
  return { code: res.content, attempts: state.attempts + 1 }
}

const ReviewSchema = z.object({
  passed: z.boolean(),
  issues: z.array(z.string()),
})

async function reviewCodeNode(state) {
  const reviewModel = model.withStructuredOutput(ReviewSchema)
  const result = await reviewModel.invoke([
    new SystemMessage('审查 Vue3 代码，检查内存泄漏、响应式使用、类型安全。'),
    new HumanMessage(state.code),
  ])
  return { review: result.issues.join('; '), passed: result.passed }
}

// 路由函数：通过了结束，没通过且没超次数就重新生成
function routeReview(state) {
  if (state.passed)         return 'end'
  if (state.attempts >= 3)  return 'end'  // 最多重试 3 次
  return 'regenerate'
}

const reviewGraph = new StateGraph(ReviewState)
  .addNode('generate', generateCodeNode)
  .addNode('review',   reviewCodeNode)
  .addEdge(START,      'generate')
  .addEdge('generate', 'review')
  .addConditionalEdges('review', routeReview, {
    end:        END,
    regenerate: 'generate', // 指回 generate，形成循环
  })
  .compile()

const result = await reviewGraph.invoke({
  requirement: '带 loading 和错误处理的数据获取 composable',
})
console.log(`生成了 ${result.attempts} 次，最终通过：${result.passed}`)
```

### 1.3 总结 langchain langgraph 
- `LangChain.js` 的核心是 `Runnable` 接口，所有组件（模型、模板、解析器）都可以用 `.pipe()` 任意组合
- `ChatPromptTemplate` 把提示词参数化，`partial()` 预填部分变量实现模板复用
- `LCEL` 的顺序链和并行链解决了多步 AI 流程的编排问题，代码比手写逻辑清晰很多
- 会话记忆用 `RunnableWithMessageHistory`，不同 `sessionId` 自动隔离，生产环境把 `InMemoryChatMessageHistory` 换成 `Redis` 实现即可
- `LangGraph` 的核心三要素：`State`（状态）、`Node`（节点）、`Edge`（边）；条件边实现动态路由，循环边实现自我修正
- `streamEvents` 比 `stream` 更细粒度，可以区分 `token` 输出和工具调用等不同事件，前端拿来推送进度更准确
