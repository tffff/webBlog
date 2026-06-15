---
title: 大模型开发概述
order: 2
---
### 1.1 为什么提示词很重要
同样一个问题，不同的提问方式，模型的输出质量可以差很多：
```md
❌ 含糊写法：
"帮我写代码"

✅ 精确写法：
"用 Vue3 Composition API 写一个 useLocalStorage Hook，要求：
1. 支持任意类型（JSON 序列化/反序列化）
2. 数据变化时自动同步到 localStorage
3. JSON 解析失败时返回传入的默认值
请先给出完整代码，然后用 3 条要点说明关键设计决策。"
```
差距的原因很直接：模型是按字面理解你说的话的，含糊的指令会得到含糊的结果
### 1.2 提示词规则
#### 1.2.1 角色设定
在 system 消息里设定角色，是提升输出质量最简单有效的手段：
```md
// 没有角色设定——模型用"通用模式"回答
messages: [{ role: 'user', content: '解释一下 useEffect' }]

// 有角色设定——模型从特定视角和风格回答
messages: [
  {
    role: 'system',
    content: `你是一位有 5 年 React 经验的前端工程师。
解释技术概念时：
- 先给出一句话的核心定义
- 用真实的业务场景举例，不要用"计数器"这种玩具示例
- 指出新手常见的误用方式`
  },
  { role: 'user', content: '解释一下 useEffect 的依赖数组' }
]
```
角色设定的几个维度：
|维度|例子|
|:---|:---|
|专业身份|"你是一位资深 Vue3 架构师"|
|受众认知|"向有 3 年经验的前端开发者解释"|
|输出风格|"语言简洁，每个观点不超过 2 句"|
|格式约束|"输出 Markdown，代码块标注正确的语言"|
|边界限制|"只讨论前端相关内容，其他话题礼貌拒绝"|
#### 1.2.2 任务描述要具体
```md
❌ "优化这段代码"

✅ "优化这段代码的性能：
1. 识别不必要的重复渲染
2. 用 useMemo/useCallback 缓存可以缓存的计算
3. 保持代码可读性，不要为了性能牺牲太多可维护性
4. 每处修改加注释说明为什么这样改"
```

#### 1.2.3 指定输出格式
不指定格式，模型会随机选它认为合适的格式，你的代码需要额外解析
```json
const systemPrompt = `
分析代码，只输出 JSON，不加任何解释文字，格式如下：
{
  "hasIssues": boolean,
  "issues": [{ "type": string, "description": string, "severity": "error"|"warning"|"info" }],
  "score": number,
  "suggestions": string[]
}
`
```

#### 1.2.4 给出示例
直接描述格式不如给示例有效。模型学格式的能力远强于理解抽象描述的能力。

#### 1.3 结构化输出
#### 1.3.1 Prompt 约束 + 容错解析
```js
async function extractData(text) {
  const res = await model.invoke([
    new SystemMessage('只返回 JSON，格式：{"name":string,"score":number}，不加任何其他内容'),
    new HumanMessage(text),
  ])

  // 容错处理：去掉可能出现的 ```json 包裹
  const cleaned = res.content.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned)
}
```
#### 1.3.2 withStructuredOutput（推荐用这个）
```js
import { z } from 'zod'

const ReviewSchema = z.object({
  hasIssues: z.boolean(),
  score: z.number().min(0).max(100).describe('代码质量评分'),
  issues: z.array(z.object({
    type: z.string(),
    description: z.string(),
    severity: z.enum(['error', 'warning', 'info']),
  })),
  suggestions: z.array(z.string()),
})

// 用 withStructuredOutput 包装模型
const structuredModel = model.withStructuredOutput(ReviewSchema)

const result = await structuredModel.invoke([
  new SystemMessage('你是 Vue3 代码审查专家，分析代码质量和潜在问题。'),
  new HumanMessage(`审查这段代码：\n${code}`),
])

// result 直接是解析好的对象，不需要 JSON.parse，不会抛异常
console.log(result.score)   // 直接取字段
console.log(result.issues)  // 类型安全
```