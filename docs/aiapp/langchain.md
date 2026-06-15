---
title: Langchain
order: 3
---

### 1.1 为什么需要 Langchain？
第一章直接用 `fetch` 调用 `API` 没问题，但项目一复杂就会遇到几个痛点：
- 每次都要手写消息格式、处理流式解析、管理对话历史
- 多步骤的 `AI` 流程（先分析、再检索、再生成）要自己串联
- 换个模型要改好几处代码
```js
原始写法：fetch → 解析 → 手动拼接历史 → 再 fetch → ...

LangChain.js：model.invoke() → 链式组合 → 自动管理历史

LangGraph：节点 + 边 + 条件路由 → 状态机驱动的 AI 流程
```

### 1.2 LangChain.js 核心用法

#### 1.2.1 模型调用
```js
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com/v1' },
  temperature: 0.7,
})
```
ChatOpenAI 是 LangChain.js 对 OpenAI 兼容接口的封装,DeepSeek、Qwen、通义千问只需改 model 和 baseURL，代码其他地方不用动。

#### 1.2.2 四种调用方式
```js
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'

// 1. invoke：一次性调用，返回 AIMessage 对象
const res = await model.invoke([
  new SystemMessage('你是 Vue3 技术专家'),
  new HumanMessage('ref 和 reactive 的区别？'),
])
console.log(res.content)      // 字符串内容
console.log(res._getType())   // 'ai'

// 2. stream：流式调用，返回 AsyncIterable
const stream = await model.stream([new HumanMessage('解释 Vue3 响应式原理')])
for await (const chunk of stream) {
  process.stdout.write(chunk.content) // 逐 token 输出
}

// 3. 并发调用（比 batch 更灵活，推荐用这个）
const questions = ['defineProps 怎么用？', 'useEffect 和 useLayoutEffect 区别？']
const responses = await Promise.all(
  questions.map(q => model.invoke([new HumanMessage(q)]))
)

// 4. 临时修改配置（不影响原模型）
const preciseModel = model.bind({ temperature: 0 })
const creativeModel = model.bind({ temperature: 1.2 })
```

#### 1.2.3 多轮对话
```js
const history = []

async function chat(userInput) {
  history.push(new HumanMessage(userInput))

  const res = await model.invoke([
    new SystemMessage('你是前端开发导师，记住学生的学习进度。'),
    ...history,  // 把完整历史传入
  ])

  history.push(new AIMessage(res.content)) // AI 回复也存入历史
  return res.content
}

await chat('我是前端新手，刚学完 HTML 和 CSS')
await chat('我想学 JavaScript，从哪里开始？')
const r = await chat('我之前说过我的基础是什么来着？') // 模型能记住
```

### 1.3 ChatPromptTemplate 提示词模板
#### 1.3.1 基本用法
```js
import { ChatPromptTemplate } from '@langchain/core/prompts'

const prompt = new ChatPromptTemplate.fromMessages([
  { role: 'system', content: '你是一个专业的前端开发导师' },
  { role: 'human', content: '{input}' },
])
// formatMessages：填入变量 → 得到可直接传给模型的 messages 数组
const messages = await prompt.formatMessages({
  role: '资深前端架构师',
  skill: 'Vue3 和性能优化',
  question: '大型 Vue3 项目应该怎么做状态管理？',
})

const res = await model.invoke(messages)
```
#### 1.3.2 模板复用
```js
const reviewPrompt = ChatPromptTemplate.fromMessages([
  ['system', `你是{lang}代码审查专家，检查：{aspects}
输出 JSON：{ "score": number, "issues": string[], "suggestions": string[] }`],
  ['human', '审查：\n```{lang}\n{code}\n```'],
])

// 复用同一模板，并发审查不同代码
const [vueResult, reactResult] = await Promise.all([
  model.invoke(await reviewPrompt.formatMessages({
    lang: 'Vue3',
    aspects: '内存泄漏、生命周期管理',
    code: vueCode,
  })),
  model.invoke(await reviewPrompt.formatMessages({
    lang: 'React',
    aspects: '性能问题、Hook 使用规范',
    code: reactCode,
  })),
])
```
#### 1.3.3 partial 预填变量
```js
const basePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是{company}的{role}，用{tone}的语气回答。'],
  ['human', '{question}'],
])

// 预填固定的部分，生成专属模板
const csPrompt = basePrompt.partial({
  company: '极速购电商平台',
  role: '客服助手',
  tone: '热情友好',
})

const techPrompt = basePrompt.partial({
  company: '极速购电商平台',
  role: '技术支持工程师',
  tone: '专业严谨',
})

// 使用时只需填剩余变量
const r1 = await model.invoke(await csPrompt.formatMessages({ question: '我的订单什么时候发货？' }))
const r2 = await model.invoke(await techPrompt.formatMessages({ question: '为什么接口返回 401？' }))
```

### 1.4 LCEL 链式调用
`LCEL（LangChain Expression Language）`用 `.pipe()` 把多个步骤串联成链，每一步是一个可组合的 `Runnable`
#### 1.4.1 最简单的链
```js
import { StringOutputParser } from '@langchain/core/output_parsers'

// prompt → model → 字符串解析器
const chain = prompt.pipe(model).pipe(new StringOutputParser())

// invoke 传入的是 prompt 的变量
const result = await chain.invoke({ question: 'Teleport 组件有什么用？' })
console.log(typeof result) // 'string'，不是 AIMessage 对象
```
`StringOutputParser` 把 `AIMessage` 转成纯字符串，后续步骤不用再 `.content` 取值

#### 1.4.2 顺序链：多步处理
```js
import { RunnableSequence } from '@langchain/core/runnables'

const parser = new StringOutputParser()

// 第一步：分析需求，提取功能点
const analyzeChain = ChatPromptTemplate.fromMessages([
  ['system', '你是需求分析师，提取核心功能点，每点一行，不超过 5 个。'],
  ['human', '需求：{requirement}'],
]).pipe(model).pipe(parser)

// 第二步：根据功能点生成组件列表
const componentChain = ChatPromptTemplate.fromMessages([
  ['system', '你是 Vue3 架构师，根据功能点列出需要的组件，格式：组件名：作用。'],
  ['human', '功能点：{features}'],
]).pipe(model).pipe(parser)

// RunnableSequence：前一步输出自动传入下一步
const pipeline = RunnableSequence.from([
  {
    features: analyzeChain,               // analyzeChain 的结果 → features
    requirement: (input) => input.requirement,
  },
  componentChain,
])

const result = await pipeline.invoke({
  requirement: '电商后台：商品管理、订单管理、数据统计看板',
})
```
#### 1.4.3 并行链：同时处理多条任务
```js
import { RunnableParallel } from '@langchain/core/runnables'

const makeChain = (systemPrompt) =>
  ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ['human', '{topic}'],
  ]).pipe(model).pipe(new StringOutputParser())

// 三条链同时执行，结果合并成一个对象
const parallelChains = RunnableParallel.from({
  pros:         makeChain('列出这个方案的 3 个优点，每点一行'),
  cons:         makeChain('列出这个方案的 3 个缺点，每点一行'),
  alternatives: makeChain('列出 2-3 个替代方案，简短说明各自适用场景'),
})

const result = await parallelChains.invoke({ topic: '用 Pinia 做 Vue3 全局状态管理' })
console.log(result.pros)          // 优点
console.log(result.cons)          // 缺点
console.log(result.alternatives)  // 替代方案
```
#### 1.4.4 链的健壮性配置
```js
// 失败自动重试
const reliableModel = model.withRetry({
  stopAfterAttempt: 3,
  onFailedAttempt: (err) => console.log(`重试中... ${err.message}`),
})

// 主模型失败时切到备用模型
const modelWithFallback = model.withFallbacks([backupModel])

// 链上的 stream 和普通调用用法一样
const chain = prompt.pipe(model).pipe(new StringOutputParser())
const stream = await chain.stream({ question: 'Vite 比 Webpack 快在哪？' })
for await (const chunk of stream) {
  process.stdout.write(chunk)
}
```
### 1.5 会话记忆管理
#### 1.5.1 RunnableWithMessageHistory
`LangChain.js` 内置的记忆管理方案，自动把历史注入到链里，不用手动维护 `history` 数组
```js
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'
import { MessagesPlaceholder } from '@langchain/core/prompts'

// 多个 session 的历史存储（生产换 Redis 或数据库）
const sessionHistories = {}

function getHistory(sessionId) {
  if (!sessionHistories[sessionId]) {
    sessionHistories[sessionId] = new InMemoryChatMessageHistory()
  }
  return sessionHistories[sessionId]
}

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是 Vue3 技术导师，记住每位学生的学习进度。'],
  new MessagesPlaceholder('history'), // 历史消息自动注入到这里
  ['human', '{input}'],
])

const chain = prompt.pipe(model).pipe(new StringOutputParser())

const chainWithMemory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: getHistory,
  inputMessagesKey: 'input',
  historyMessagesKey: 'history',
})

// 每次调用传 sessionId 区分不同用户，互相隔离
const aliceConfig = { configurable: { sessionId: 'alice' } }
const bobConfig   = { configurable: { sessionId: 'bob' } }

await chainWithMemory.invoke({ input: '我刚开始学 Vue3' }, aliceConfig)
const r = await chainWithMemory.invoke({ input: '我上次说我在学什么？' }, aliceConfig)
// r 里模型能正确回答"在学 Vue3"
```
#### 1.5.2 滑动窗口：防止上下文超长
对话轮次多了，历史记录会超过模型的上下文限制。滑动窗口是最简单的应对方案
```js
class SlidingWindowChat {
  constructor({ systemPrompt, maxTokens = 3000 }) {
    this.systemPrompt = systemPrompt
    this.history = []
    this.maxTokens = maxTokens
  }

  // 粗略估算 token 数，中文 0.6 token/字
  estimateTokens(messages) {
    return messages.reduce(
      (sum, m) => sum + Math.ceil((m.content?.length ?? 0) * 0.6),
      0
    )
  }

  // 超出限制时删除最早的一对消息（user + assistant 成对删）
  trimToFit() {
    while (
      this.history.length > 2 &&
      this.estimateTokens(this.history) > this.maxTokens
    ) {
      this.history.splice(0, 2)
    }
  }

  async chat(userInput) {
    this.history.push(new HumanMessage(userInput))
    this.trimToFit()

    const res = await model.invoke([
      new SystemMessage(this.systemPrompt),
      ...this.history,
    ])

    this.history.push(new AIMessage(res.content))
    return res.content
  }
}

const chat = new SlidingWindowChat({ systemPrompt: '你是前端助手', maxTokens: 2000 })
```
