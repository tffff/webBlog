---
title: 大模型开发概述
order: 1
---
 ### 1.1 大模型是什么
大模型（LLM，Large Language Model）本质上是一个接受文本输入、返回文本输出的函数。从工程角度来说，
你不需要理解它内部的神经网络结构，只需要知道：
- 给它一段文字（Prompt），它会返回一段文字（Completion）
- 它的能力来自在海量文本上的预训练，具备语言理解、推理、生成能力
- 通过 HTTP API 调用，和调用任何后端接口没有本质区别

类比：大模型就像一个能理解自然语言的超级函数，你传入参数（问题、指令），它返回结果（回答、代码、分析）。
### 1.2 核心概念

#### 1.2.1 Token
`Token` 是大模型处理文本的基本单位，既不是字符，也不是单词，而是介于两者之间的"词片"
```json
英文："Hello World"  → ["Hello", "World"]            → 2 tokens
中文："你好世界"      → ["你", "好", "世", "界"]       → 大约 4 tokens
代码："const x = 1"  → ["const", " x", " =", " 1"]  → 4 tokens
```
Token 的工程意义：
- API 按 Token 计费，输入和输出分别计价
- 模型有最大上下文长度限制，DeepSeek-chat 支持 64K tokens
- Token 数量影响响应速度和成本

快速估算规则（不用装 tiktoken，这个精度够用）：
- 英文：1 token ≈ 4 个字符
- 中文：1 个汉字 ≈ 1.5~2 tokens，按 0.6 token/字估算
- 代码：比文字消耗更多 token

#### 1.2.2 上下文窗口（Context Window）
大模型每次调用都是无状态的——它不记得上一次对话。要实现多轮对话，需要每次都把完整的历史记录作为输入传给模型
```json
第一轮：[用户:"你好"] → 模型回复
第二轮：[用户:"你好", 助手:"你好！", 用户:"我叫张三"] → 模型回复
第三轮：[用户:"你好", 助手:"...", 用户:"我叫张三", 助手:"...", 用户:"你还记得我叫什么吗？"] → 模型回复
```
这就是上下文——每次请求都要携带完整的对话历史。上下文窗口的限制带来了一个工程问题：对话太长超过限制时怎么处理？

#### 1.2.3 温度参数（Temperature）
Temperature 控制模型输出的随机性，取值范围 0~2


|Temperature	|特点	|适用场景
| :---: | :---: | :---: |
|0	|确定性输出，每次结果几乎相同|代码生成、数据提取、分类
|0.2~0.5	|低随机，结果稳定但有轻微变化|客服问答、摘要
|0.7	|中等随机，有创造性但不失控|通用对话（默认值）
|1.0~1.5	|高随机，创意性强但可能跑偏|写作、头脑风暴

#### 1.2.4 消息角色（Messages）
消息角色（Messages）是指在对话中，用户和助手之间的角色。用户是发起对话的实体，助手是响应用户的实体。

OpenAI 兼容 API（DeepSeek、Qwen、Claude 等都支持）使用三种角色
```json
messages: [
  { role: 'system', content: '你是一位前端开发导师' },   // 系统提示，定义角色和行为
  { role: 'user', content: '什么是 Vue3 的响应式？' },   // 用户消息
  { role: 'assistant', content: '...' },                 // 模型的上一条回复
  { role: 'user', content: '能举个例子吗？' },           // 继续对话
]
```
### 1.3 api key 申请调用

#### 1.3.1 申请 api key
- 前往 [OpenAI 官网](https://openai.com/) 注册账号（或者[deepseek](https://platform.deepseek.com)）
- 登录后，点击 "API Keys" 按钮
- 点击 "Create new secret key" 按钮，生成新的 API key
- 复制生成的 API key，后续调用 API 时需要使用

#### 1.3.2 调用 api(原生fetch调用)
DeepSeek 兼容 OpenAI API 格式，Node.js 18+ 内置 fetch，不需要安装任何包
```js
// nodejs-fetch.js
import 'dotenv/config'

const API_URL = 'https://api.deepseek.com/v1/chat/completions'

async function chat(userMessage) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: userMessage }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`API 错误 ${res.status}: ${err.error?.message}`)
  }

  const data = await res.json()
  const reply = data.choices[0].message.content
  const usage = data.usage // { prompt_tokens, completion_tokens, total_tokens }

  console.log('回复：', reply)
  console.log('Token 用量：', usage)

  return { reply, usage }
}

chat('用一句话解释什么是大模型').catch(console.error)
```
响应结构
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "大模型是基于海量文本训练的大规模语言模型..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 38,
    "total_tokens": 50
  }
}
```
#### 1.3.3 用 LangChain.js 调用
实际项目里推荐用 LangChain.js，好处是屏蔽底层 HTTP 细节、统一接口、换模型只改配置不改代码
```js
// langchain-basic.js
import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com/v1' },
  temperature: 0.7,
})

const res = await model.invoke([
  new SystemMessage('你是一位耐心的前端开发导师，擅长用类比解释技术概念。'),
  new HumanMessage('用"盖房子"来类比解释什么是大模型应用开发'),
])

console.log(res.content)
```

### 1.4 SSE 流式输出
流式输出是指模型在生成回复时，会实时返回部分回复，而不是等模型生成完整回复后再返回。这样体验上效果更好

#### 1.4.1 服务端：Express + SSE
浏览器的 EventSource API 只支持 GET 请求，所以常见做法是：前端用 fetch + ReadableStream 发 POST，服务端返回 SSE 格式的流。
```js
// server.js
import 'dotenv/config'
import express from 'express'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

const app = express()
app.use(express.json())
app.use(express.static('.'))

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com/v1' },
  streaming: true,
})

app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body

  // SSE 必须设置这三个响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    // stream() 返回 AsyncIterable，逐 chunk 推送
    const stream = await model.stream([new HumanMessage(message)])

    for await (const chunk of stream) {
      if (chunk.content) {
        // SSE 格式：event 行 + data 行 + 空行
        res.write(`event: token\ndata: ${JSON.stringify({ token: chunk.content })}\n\n`)
      }
    }

    res.write('event: done\ndata: {}\n\n')
  } catch (err) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`)
  } finally {
    res.end()
  }
})

app.listen(3000, () => console.log('http://localhost:3000'))
```
#### 1.4.2 Vue3 前端接收流
```vue
<template>
  <div>
    <textarea v-model="input" placeholder="输入你的问题..." rows="3" />
    <button @click="send" :disabled="loading">{{ loading ? '生成中...' : '发送' }}</button>
    <div class="output">
      {{ output }}<span v-if="loading" class="cursor" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const loading = ref(false)

async function send() {
  if (!input.value.trim() || loading.value) return
  loading.value = true
  output.value = ''

  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input.value }),
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() // 保留未完整的行，等下一个 chunk 来拼

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.token) output.value += data.token
        } catch {}
      }
      if (line === 'event: done') loading.value = false
    }
  }

  loading.value = false
}
</script>

<style scoped>
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: currentColor;
  vertical-align: text-bottom;
  animation: blink .7s infinite;
}
@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
</style>
```