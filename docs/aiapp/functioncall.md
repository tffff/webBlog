---
title: FunctionCall
order: 5
---
让大模型从"只能说话"升级到"能调用工具干活"。Function Call 是大模型应用里最有工程价值的特性之一，客服系统、数据查询、自动化操作全靠它。
### 1.1 Function Call 是什么
没有 Function Call，模型只能靠训练时学到的知识回答问题，它不知道今天的天气、你的订单状态、你数据库里的数据。
有了 Function Call，流程变成这样:
```md
用户："我的 ORD-001 订单到哪了？"
    ↓
模型判断：需要调用 get_order 工具，参数 orderId="ORD-001"
    ↓
代码执行工具：查数据库，返回 { status: "已发货", tracking: "SF123..." }
    ↓
模型整合结果：生成自然语言回复
    ↓
"您好！您的订单 ORD-001 已于昨天发货，物流单号 SF123..."
```
模型本身并不执行工具，它只是"决定调哪个工具、传什么参数"。实际执行是你的代码负责的。

### 1.2 基础流程
#### 1.2.1 用 Zod 定义工具
`LangChain.js` 用 `tool()` 函数定义工具，`Zod Schema` 描述参数结构——这个描述是给模型看的，模型根据它判断何时调用、传什么参数
```js
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

const getWeatherTool = tool(
  // 第一个参数：工具的执行函数
  async ({ city, unit = 'celsius' }) => {
    // 这里调真实 API 或查数据库
    const data = await fetchWeatherAPI(city)
    return JSON.stringify({
      city,
      temperature: `${data.temp}${unit === 'celsius' ? '°C' : '°F'}`,
      condition: data.condition,
      suggestion: data.condition.includes('雨') ? '记得带伞' : '天气不错',
    })
  },
  // 第二个参数：描述（给模型看的）
  {
    name: 'get_weather',
    description: '获取指定城市的实时天气。用户询问天气时调用，不要自己编造天气数据。',
    schema: z.object({
      city: z.string().describe('城市名称，如：北京、上海'),
      unit: z.enum(['celsius', 'fahrenheit'])
        .default('celsius')
        .describe('温度单位，默认摄氏度'),
    }),
  }
)
```
`description` 非常重要，写得越清楚，模型越能在正确的时机调用正确的工具

#### 1.2.2 完整调用流程
```js
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com/v1' },
  temperature: 0,  // 工具调用场景用低温度，保证参数准确
})

async function chat(userMessage) {
  // 第一步：bindTools 让模型知道有哪些工具可用
  const modelWithTools = model.bindTools([getWeatherTool])

  const messages = [
    new SystemMessage('你是天气助手，查询天气时必须使用工具获取真实数据。'),
    new HumanMessage(userMessage),
  ]

  // 第二步：第一次调用，模型决定是否调用工具
  const firstResponse = await modelWithTools.invoke(messages)

  // 没有 tool_calls → 模型直接回答，不需要工具
  if (!firstResponse.tool_calls?.length) {
    return firstResponse.content
  }

  // 第三步：执行工具
  const toolMessages = []
  for (const call of firstResponse.tool_calls) {
    console.log(`调用工具：${call.name}，参数：`, call.args)
    const result = await getWeatherTool.invoke(call.args)

    // ToolMessage 的 tool_call_id 必须与 call.id 对应
    // 模型靠这个 id 关联"调用请求"和"执行结果"
    toolMessages.push(
      new ToolMessage({ content: result, tool_call_id: call.id })
    )
  }

  // 第四步：把工具结果传回模型，生成最终回复
  const finalResponse = await modelWithTools.invoke([
    ...messages,
    firstResponse,    // 模型第一次的响应（必须带上，含 tool_calls 字段）
    ...toolMessages,  // 工具执行结果
  ])

  return finalResponse.content
}

// 测试
await chat('北京今天天气怎么样？')       // 触发工具
await chat('你好，介绍一下你自己')       // 不触发工具
```
消息顺序很重要：`messages` → `firstResponse` → `toolMessages` → `finalResponse`，这个顺序不能乱，模型需要看到完整的调用链才能生成正确的回复

#### 1.3 LangGraph ToolNode：自动执行工具
手动写 `for (const call of firstResponse.tool_calls)` 循环没问题，但实际项目里工具多了会很繁琐。`LangGraph` 的 `ToolNode` 自动处理这些
```js
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { StateGraph, END, START, Annotation, messagesStateReducer } from '@langchain/langgraph'

const tools = [getUserInfoTool, getOrderTool, calcPointsTool]

// ToolNode 自动：
// 1. 取出最后一条 AIMessage 里的所有 tool_calls
// 2. 并发执行所有工具
// 3. 把结果包装成 ToolMessage 追加到 messages
const toolNode = new ToolNode(tools)

const State = Annotation.Root({
  messages: Annotation({ reducer: messagesStateReducer, default: () => [] }),
})

async function agentNode(state) {
  const response = await model.bindTools(tools).invoke([
    new SystemMessage('你是电商客服，使用工具查询真实数据后回答。'),
    ...state.messages,
  ])
  return { messages: [response] }
}

// 路由：有 tool_calls 就执行工具，没有就结束
function routeAfterAgent(state) {
  const last = state.messages[state.messages.length - 1]
  return last.tool_calls?.length ? 'tools' : '__end__'
}

const graph = new StateGraph(State)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', routeAfterAgent, {
    tools: 'tools',
    __end__: END,
  })
  .addEdge('tools', 'agent')  // 工具执行完，回 agent 生成最终回复
  .compile()

const result = await graph.invoke({
  messages: [new HumanMessage('查一下用户 user_001 的信息和他的 ORD-001 订单')],
})
```
这个"agent → tools → agent"的循环结构，就是 `ReAct Agent` 的基础骨架。模型可以多轮调用工具：调完一批，看结果，再决定要不要继续调。

### 1.4 并行工具调用
```js
// 模拟有延迟的工具
const getStockPrice   = tool(async ({ symbol }) => { await sleep(800); ... }, { name: 'get_stock_price', ... })
const getExchangeRate = tool(async ({ from, to }) => { await sleep(600); ... }, { name: 'get_exchange_rate', ... })
const getMarketNews   = tool(async ({ topic }) => { await sleep(700); ... }, { name: 'get_market_news', ... })

// 用户问这个问题，模型会一次调用 3 个工具
const result = await graph.invoke({
  messages: [new HumanMessage('苹果股价多少？美元汇率是多少？最新科技新闻有什么？')],
})

// 串行耗时：800 + 600 + 700 = 2100ms
// 并发耗时：max(800, 600, 700) ≈ 800ms
// ToolNode 自动并发，不需要额外配置
```
实际上不是所有模型都支持并行工具调用，`DeepSeek` 和 `GPT-4o` 都支持。触发并行的关键是：提示词里告诉模型"可以同时调用多个工具"，否则它可能选择串行
```js
new SystemMessage(`你是金融数据助手。
重要：当用户询问多个数据时，同时调用多个工具，不要逐个询问。`)
```

### 1.5 有副作用的工具
写入数据库、发邮件、修改状态——这类工具需要额外注意
#### 1.5.1 幂等性：防止重复执行
```js
const addTodoTool = tool(
  async ({ title, priority }) => {
    // 先查是否已存在，防止重复添加
    const exists = await db.todos.findOne({ title })
    if (exists) {
      return JSON.stringify({ success: false, message: `"${title}" 已存在，ID: ${exists.id}` })
    }

    const todo = await db.todos.create({ title, priority, done: false })
    return JSON.stringify({ success: true, todo })
  },
  { name: 'add_todo', description: '添加新的待办事项', schema: ... }
)
```
#### 1.5.2 破坏性操作要求确认
```js
const deleteTodoTool = tool(
  async ({ id, confirm }) => {
    // 删除是不可逆操作，必须明确传 confirm: true
    if (!confirm) {
      return JSON.stringify({
        success: false,
        message: '删除操作不可撤销，请将 confirm 设为 true 确认执行',
      })
    }
    await db.todos.delete({ id })
    return JSON.stringify({ success: true, message: `ID ${id} 已删除` })
  },
  {
    name: 'delete_todo',
    description: '删除待办事项，不可撤销，必须将 confirm 设为 true',
    schema: z.object({
      id: z.number(),
      confirm: z.boolean().describe('必须为 true 才执行删除，防止误操作'),
    }),
  }
)
```

#### 1.5.3 工具的权限控制
```js
// 在工具执行函数里检查权限，而不是依赖模型判断
const transferMoneyTool = tool(
  async ({ fromAccount, toAccount, amount }, config) => {
    // config.configurable 可以传入运行时上下文（如当前用户）
    const userId = config?.configurable?.userId
    if (!userId) return JSON.stringify({ error: '未登录' })

    // 检查转账金额是否超过每日限额
    const dailyTotal = await getDailyTransferTotal(userId)
    if (dailyTotal + amount > 50000) {
      return JSON.stringify({ error: '超过每日转账限额 5 万元' })
    }

    // 执行转账...
  },
  { name: 'transfer_money', ... }
)
```

### 1.6 实时推送工具调用状态（SSE）
前端要实时显示"正在调用 get_order 工具..."，用 streamEvents 监听工具相关事件：

```js
// 服务端
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

  for await (const event of graph.streamEvents(
    { messages: [new HumanMessage(req.body.message)] },
    { version: 'v2' }
  )) {
    // 工具开始执行
    if (event.event === 'on_tool_start') {
      send('tool_start', {
        toolName: event.name,
        args: event.data?.input,
      })
    }

    // 工具执行完成
    if (event.event === 'on_tool_end') {
      send('tool_end', {
        toolName: event.name,
        result: event.data?.output,
      })
    }

    // 模型输出 token
    if (event.event === 'on_chat_model_stream' && event.data?.chunk?.content) {
      send('token', { token: event.data.chunk.content })
    }
  }

  send('done', {})
  res.end()
})
```
Vue3前端接受
```vue
<script setup>
import { ref } from 'vue'

const toolCalls = ref([])
const activeTools = {}

async function send(message) {
  toolCalls.value = []

  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  const reader  = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer    = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // SSE 协议：event 和 data 在同一个块里，块之间用 \n\n 分隔
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const lines = part.split('\n')
      let eventType = 'message'
      let dataStr = ''

      for (const line of lines) {
        if (line.startsWith('event: ')) eventType = line.slice(7)
        if (line.startsWith('data: '))  dataStr = line.slice(6)
      }

      if (!dataStr) continue
      const data = JSON.parse(dataStr)

      if (eventType === 'tool_start') {
        const tc = {
          id: Date.now(),
          toolName: data.toolName,
          args: data.args,
          status: 'running',
          startTime: Date.now(),
        }
        activeTools[data.toolName] = tc
        toolCalls.value.push(tc)
      }

      if (eventType === 'tool_end') {
        const tc = activeTools[data.toolName]
        if (tc) {
          tc.result = data.result
          tc.status = 'done'
          tc.duration = Date.now() - tc.startTime
        }
      }
    }
  }
}
</script>

<template>
  <!-- 工具调用列表 -->
  <div v-for="tc in toolCalls" :key="tc.id" class="tool-card" :class="tc.status">
    <div class="tool-name">{{ tc.toolName }}</div>
    <div class="tool-status">{{ tc.status === 'running' ? '执行中...' : `完成 (${tc.duration}ms)` }}</div>
    <pre v-if="tc.args">入参：{{ JSON.stringify(tc.args, null, 2) }}</pre>
    <pre v-if="tc.result">出参：{{ tc.result }}</pre>
  </div>
</template>
```
### 1.7 withStructuredOutput vs Function Call
这两个都能让模型返回结构化数据，区别在于：
|特性|withStructuredOutput|Function Call
|:--|:--|:--|
|目的	|强制输出符合 Schema 的 JSON	|让模型调用外部工具/API
|执行	|只是格式约束，没有实际执行	|需要你的代码执行工具逻辑
|适合场景	|数据提取、意图分类、格式转换	|查数据库、调 API、操作文件
|返回给用户	|直接用结构化数据	|工具结果再由模型整合成自然语言
```js
// withStructuredOutput：提取结构化数据，不执行任何操作
const IntentSchema = z.object({
  intent: z.enum(['order_inquiry', 'refund', 'complaint']),
  urgency: z.enum(['low', 'normal', 'high']),
})
const classifier = model.withStructuredOutput(IntentSchema)
const result = await classifier.invoke([new HumanMessage('我的快递三天没动静了！')])
// result = { intent: 'order_inquiry', urgency: 'high' }

// Function Call：调用真实的工具获取数据
const modelWithTools = model.bindTools([getOrderTool])
// 模型决定调用 getOrderTool，代码执行查询，模型整合结果
```

### 1.8 工具设计的几个原则
- 工具描述要清晰，说明何时调用
```js
// 不好：模型不知道什么时候该用这个工具
description: '获取商品信息'

// 好：明确触发条件，说明能做什么、不能做什么
description: '在商品库中搜索商品，支持关键词过滤和价格范围。仅用于查询商品，不能查询订单或用户信息。'
```
- 工具返回值要包含足够的上下文
```js
// 不好：模型只有结果，没有上下文
return JSON.stringify({ price: 89 })

// 好：包含足够信息让模型生成有价值的回复
return JSON.stringify({
  productName: 'iPhone 15 手机壳',
  price: 89,
  originalPrice: 129,
  discount: '6.9折',
  inStock: true,
  rating: '4.8分（1.2万件已售）',
})
```
- 工具函数不能抛异常 要返回错误信息
```js
// 不好：抛异常会导致 ToolNode 整个失败
async ({ orderId }) => {
  const order = await db.query(...)
  if (!order) throw new Error('订单不存在') // ❌
}

// 好：返回带错误信息的 JSON，模型能据此回复用户
async ({ orderId }) => {
  try {
    const order = await db.query(...)
    if (!order) return JSON.stringify({ error: `订单 ${orderId} 不存在` }) // ✓
    return JSON.stringify(order)
  } catch (e) {
    return JSON.stringify({ error: `查询失败：${e.message}` }) // ✓
  }
}
```

### 1.9 总结
- `Function Call `的本质：模型负责"决策"（调哪个工具、传什么参数），代码负责"执行"，形成分工
- 完整流程四步：绑定工具 → 第一次调用（模型决策）→ 执行工具 → 第二次调用（整合结果）
- `ToolNode` 自动执行工具，并发处理多个调用，不需要手动写循环
- 工具描述是给模型看的，写得越清楚，模型越能在正确的时机调用正确的工具
- 有副作用的工具要做幂等性检查，破坏性操作要设置确认机制
- `streamEvents` 监听 `on_tool_start` 和 `on_tool_end` 事件，可以实时推送工具调用状态到前端
- `withStructuredOutput` 用于格式约束，`Function Call ` 用于真实工具调用，两者目的不同
