---
title: RAG 检索增强
order: 6
---
大模型的知识截止到训练日期，不知道你的公司文档、内部规范、最新数据。RAG（Retrieval-Augmented Generation）让模型能访问你的私有知识库，回答基于真实文档的问题
### 1.1 RAG 解决什么问题
直接问模型"我们公司的请假流程是什么"，它不知道。你把所有公司文档塞进 Prompt，超过上下文限制。

RAG 的思路
```md
用户提问
    ↓
在知识库里找到最相关的几段文档（检索）
    ↓
把这几段文档 + 用户问题一起发给模型
    ↓
模型根据文档内容回答（生成）
```
关键点：不是把所有文档都给模型，而是每次只给最相关的几段文档。

**RAG 完整流程**
```js
离线阶段（文档入库）：
文档 → 分片（Chunking）→ 向量化（Embedding）→ 存入向量数据库

在线阶段（用户提问）：
用户问题 → 向量化 → 向量数据库检索 → 取出相关文档 → 拼入 Prompt → 模型生成回答
```
### 1.2  Embedding：文本变向量
Embedding 是把文本转换成一串数字（向量），语义相近的文本，它们的向量在高维空间中的距离也近。
```js
import { OpenAIEmbeddings } from '@langchain/openai'

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',  // 1536 维，性价比好
  apiKey: process.env.OPENAI_API_KEY,
})

// 单个文本向量化
const vector = await embeddings.embedQuery('Vue3 的响应式系统基于 Proxy 实现')
console.log(vector.length)   // 1536
console.log(vector.slice(0, 3))  // [-0.012, 0.034, -0.089, ...]

// 批量向量化（批量折扣，更便宜）
const vectors = await embeddings.embedDocuments([
  'Vue3 的响应式系统基于 Proxy',
  'React 使用虚拟 DOM',
  '今天天气不错',
])
```
余弦相似度：衡量两段文字有多像
```js
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dot   += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i] 
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
  // 返回 -1 到 1，越接近 1 越相似
}

// 实测示例（text-embedding-3-small）：
// "Vue3 props 怎么传?" vs "Vue3 中使用 defineProps 接收父组件数据"  → 0.87（很相似）
// "Vue3 props 怎么传?" vs "React 的 props 怎么用？"               → 0.72（话题相近）
// "Vue3 props 怎么传?" vs "今天股市大涨"                           → 0.21（无关）
```
为什么用向量搜索而不是关键词搜索
```md
// 用户问：「怎么让父子组件的数据保持同步？」（没有 v-model 关键词）

// 关键词搜索：无结果（文档里有 v-model 但问题里没提）
const keywordResult = docs.filter(d => d.includes('保持同步'))  // []

// 向量语义搜索：能找到 v-model 相关文档（语义匹配）
const semanticResult = await similaritySearch('怎么让父子组件的数据保持同步')
// → 找到"使用 v-model 实现双向绑定"的文档
```

### 1.3  向量数据库：Chroma
- 存入文档
```js
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { Document } from '@langchain/core/documents'

// 创建向量库，自动把文档向量化并存入 Chroma
const vectorStore = await Chroma.fromDocuments(
  [
    new Document({
      pageContent: `Vue3 组件通信
父传子：defineProps() 接收数据。子传父：defineEmits() 触发事件。
跨层级：provide/inject，祖先组件 provide，后代组件 inject。`,
      // metadata 可以存任意键值对，用于后续过滤
      metadata: { source: 'vue3-guide', category: 'components', title: 'Vue3 组件通信' },
    }),
    // 更多文档...
  ],
  embeddings,
  {
    collectionName: 'frontend-docs',  // 集合名，类似数据库的表名
    url: 'http://localhost:8000',
  }
)
```
- 检索
```js
// 基础检索：返回最相似的 k 个文档
const docs = await vectorStore.similaritySearch('组件之间怎么传数据？', 3)
docs.forEach(doc => console.log(doc.pageContent, doc.metadata))

// 带分数的检索
const results = await vectorStore.similaritySearchWithScore('组件之间怎么传数据？', 3)
results.forEach(([doc, score]) => {
  console.log(`相似度 ${score.toFixed(4)}：${doc.pageContent.slice(0, 60)}`)
})

// 带元数据过滤（只在 vue3-guide 里搜）
const filtered = await vectorStore.similaritySearch(
  '数据变化怎么监听？',
  3,
  { source: 'vue3-guide' }  // filter
)
```
### 1.4 文档分片（Chunking）
```js
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,      // 每个片段最多 500 字符
  chunkOverlap: 50,    // 相邻片段重叠 50 字符（防止语义在边界断裂）
  // 分割顺序：先按段落，不够再按句子，再按词，最后按字符
  separators: ['\n\n', '\n', '。', '，', ' ', ''],
})

const longText = `...一篇很长的技术文档...`

// 分成多个 Document 对象
const chunks = await splitter.createDocuments(
  [longText],
  [{ source: 'my-doc', title: '文档标题' }]  // 每个 chunk 都继承这个 metadata
)

console.log(`${longText.length} 字 → ${chunks.length} 个分片`)
```
分片大小的经验值：
- 技术文档：500~800 字符，保留一个完整的概念
- 对话记录：200~400 字符，按对话轮次分
- 代码文件：按函数或类分割，而不是按字符数
- Overlap：通常是 chunkSize 的 10%~15%

**构建完整的RAG链**
```js
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

// 1. 把向量库封装成检索器
const retriever = vectorStore.asRetriever({
  k: 3,
  searchType: 'similarity',
})

// 2. RAG 提示词
const ragPrompt = ChatPromptTemplate.fromMessages([
  ['system', `你是知识库问答助手。根据参考文档回答用户问题。
规则：
- 只基于参考文档回答，不要使用文档外的知识
- 如果文档中没有相关内容，明确说"文档中没有找到相关信息"
- 在回答末尾标注参考来源`],
  ['human', `参考文档：
{context}

用户问题：{question}`],
])

// 3. 格式化检索文档
function formatDocs(docs) {
  return docs
    .map((doc, i) =>
      `[${i + 1}] 来源：${doc.metadata.title}\n${doc.pageContent}`
        )
    .join('\n\n---\n\n')
}

// 4. 组装 RAG 链（LCEL 方式）
const ragChain = RunnableSequence.from([
  {
    // 并行：检索文档 + 透传问题
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  ragPrompt,
  model,
  new StringOutputParser(),
])

// 5. 使用
const answer = await ragChain.invoke('Vue3 的 computed 和 methods 有什么区别？')
console.log(answer)
```
**带溯源的 RAG**
```js
const ragWithSources = RunnableSequence.from([
  RunnablePassthrough.assign({
    docs: (input) => retriever.invoke(input.question),
  }),
  RunnablePassthrough.assign({
    context: (input) => input.docs.map(d => d.pageContent).join('\n\n'),
  }),
  {
    // 同时生成答案和整理来源
    answer: ragPrompt.pipe(model).pipe(new StringOutputParser()),
    sources: (input) => input.docs.map(d => ({
      title: d.metadata.title,
      source: d.metadata.source,
      preview: d.pageContent.slice(0, 80) + '...',
    })),
  },
])

const result = await ragWithSources.invoke({ question: '...' })
console.log(result.answer)
console.log(result.sources)  // [{ title, source, preview }]
```