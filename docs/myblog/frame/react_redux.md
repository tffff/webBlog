---
title: Redux初探
date: 2022-01-09 21:00:10
---

# Redux 初探

## 什么是 Redux?

因为 react 里面 props 是一级一级传的，state 是组件内部状态管理，而且 react 是单向数据流，如果出现一个数据状态非常复杂就很难让两个组件共享数据，这时候就需要一个所有的 state 数据集中在组件的顶部然后分发给其他组件，这就是集中状态管理 redux。redux 就是一个 js 状态容器，提供可预测化的状态管理。

改变 state 的唯一方法就是 store.dispath 触发一个 action,然后根据 action 执行 reducer 完成 state 更新，其他组件可以订阅 store 中的状态 state 来刷新自己的视图

**要点：**

应用中的所有 state 都是一个对象树的形式存储在一个单一的 store 中，唯一改变 state 的方式就是派发 action

action:一个描述发生了什么的对象，动作，行为

reducer: 为了描述 action 如何改变 state 树

## Redux 的好处？

- 解决多级传递数据
- 解决兄弟组件数据传递
- 可以将数据连接到任何组件

## Redux 的使用场景

- 公共组件，业务组件非常多，用户使用方式比较复杂，项目庞大
- 不同用户校色权限管理
- 需要与服务器大量的交互，聊天，直播等
- view 需要从多个来源获取数据
- react 解决不了的，多交互，多数据源
  :::warning 注意
  不要盲目引入 redux,否则只会增加复杂度
  :::

## Redux 是如何工作的？

action:，描述发生了什么的一个对象，动作，指令

reducer:数据控制器，数据的修改者。action.type,具体做什么，返回一个 newState

store：公共数据源

**使用过程**
创建 store,创建 action,创建 reducer

## Redux 的三大原则

1. 单一数据源
2. state 只读，只能通过出发 action 改变 state,只能表达想要修改的意图，修改的动作在 reducer 里面执行
3. reducre 使用纯函数进行修改，为了描述 action 如何改变 state

## redux 解析

- store -> container
- currentState -> value
- action -> f 变形关系
- reducer -> map
- middleware -> IO functor(解决异步和脏操作)
