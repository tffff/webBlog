---
title: vue面试汇总
date: 2022-01-26 16:30:10
nav:
  title: 面试
  order: 1
group:
  title: 框架
  order: 2
---

## 1、v-for和v-if为什么不能一起使用？

`v-for `优先级高于 `v-if`，会先执行循环，再判断条件，造成性能浪费和逻辑歧义
> 在 Vue3 中虽然可以一起用，但官方仍然不推荐，因为会影响 diff 性能和代码可读性，最佳实践是通过 computed 进行数据层过滤。

## 2、vue 组件的通信方式
- 父子组件：props和emit，也可以选择ref
- 兄弟组件：eventBus,也可以选择$parent
- 祖先与后代：provide和inject
- 全局：vuex pinia

## 3、vuex和pinia的区别? 为什么官方更推荐pinia？
- 无 mutations
- 支持 TS
- 更轻量
- Composition API 风格

## 4、vue2和vue3的区别
- 响应式：`Vue2` 用 `Object.defineProperty`，`Vue3` 用 `Proxy`
- 性能：`Vue3` 更快（初始化、更新、内存），包括更小的打包大小、更快的虚拟DOM的重写、更高效的组件初始化等，vue2在性能方面相对较慢，尤其是处理大型应用和复杂组件时
- 组合式 `API（Composition API）`
- 更好的 `TS` 支持
- 更好的模块化支持 `Tree-shaking`（按需打包）
- 新特性和改进 如：`teleport`、`Suspense`、`Fragment`等,为开发提供了更多的可能性和便利
    - `teleport`：将组件渲染到指定的 DOM 元素中，而不是默认的 body 中
    - `Suspense`：异步组件的加载状态管理，提供默认内容和加载状态的控制
    - `Fragment`：将多个子元素组合成一个虚拟 DOM 元素，避免额外的 DOM 操作

👉 面试加分点：

>Vue3 重写了响应式系统，解决了 Vue2 无法监听新增/删除属性的问题。

## 5、vue3响应式原理？
👉 核心：
- `Proxy` 拦截 get/set
- `track`: 收集依赖
- `trigger`: 触发更新

## 6、封装组件一般是怎么封装的？
- 组件拆分原则
    - ui与逻辑分离：展示组件只负责ui，容器组件只负责业务逻辑和数据
    - 单一职责：一个组件只负责一件事
    - 高内聚低耦合：props明确，事件清晰
- 什么时候抽`composable`?
    - 逻辑可以复用的（分页、表单校验等）
    - 逻辑复杂、影响组件可读性
    - 与生命周期强相关

👉 升级问法？
 `composable`与普通攻击函数有什么区别？
- `composable`是带vue响应式能力的可复用逻辑
- 普通工具函数只是纯计算，不带响应式能力

## 7、shallowRef是什么？
`shallowRef`只做浅层响应式，只追踪`.value`本身的变更，不会深层代理对象内部属性的变更。
使用场景：大型表单对象、配置项、不需要深层响应的大数据
```js
import { shallowRef } from 'vue'

const state = shallowRef({count:0})

//提问
state.value.count++ 会触发视图的更新吗？//不会 因为count是shallowRef的属性，不是shallowRef本身

//升级
const state1=shallowReactive({count:0})

//提问
state1.count++ 会触发视图更新吗？//会 因为count是shallowReactive的属性，是shallowReactive本身
```
 
 ## 8、created和mounted的区别？
 - created生命周期钩子
    - created 生命周期钩子在组件实例被创建之后立即被调用，在这个阶段，组件实例已经被创建，但是还没有渲染到DOM中，可以在这个阶段执行一些与数据初始化和逻辑处理相关的任务，但无法访问到已经渲染的DOM元素
    - 通常用于进行数据的初始化、设置初始状态、进行异步请求（比如获取数据）,以及数据准备好后执行逻辑
- mounted生命周期钩子
    - mounted 生命周期钩子在组件的模板已经渲染到DOM中之后触发，在这个阶段，可以访问DOM元素，通常用于执行需要访问DOM的任务，例如操作DOM元素、添加事件监听器或者执行与DOM相关的操作
    - 通常用于执行需要等待DOM渲染完成之后才能执行的任务，以确保可以操作已经存在的DOM元素
## 9、Vue的父组件和子组件的生命周期钩子函数执行顺序？
- 加载渲染过程:父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
- 子组件更新过程：父breforeUpdate->子beforeUpdate->子updated->父updated
- 父组件更新过程：父beforeUpdate->父update
- 销毁过程：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

## 10、watch和computed的区别？
computed:
- 计算属性：创建计算属性的方式，依赖于Vue的响应式系统进行数据追踪，当依赖的数据发生变化时，计算属性会自动重新计算，而且只在必要时才重新计算
- 缓存：计算属性具有缓存机制，只有在依赖的数据发生变化时才会重新计算，意味着多次访问同一个计算属性会返回相同的结果，不会重复计算
- 无副作用：不会修改数据本身
- 用于模板中：计算属性通常用于模板中，以便于在模板中展示派生数据
- 必须同步：只对同步代码中的依赖响应

watch:
- 监听数据：监听数据的变化，可以监听一个或者多个数据项
- 副作用操作：watch回调函数可以执行副作用造成，例如发生网络请求、手动操作DOM、或执行其他需要的逻辑
- 不缓存：依赖变化立即执行回调函数
- 用于监听数据的变化：一般不在模板中直接展示
- 支持异步：监测数据变化后，可进行同步或异步操作

## 11、vue3中ref和reactive的区别？
- ref：创建响应式数据，只能用于单个值，不能用于对象或数组
- reactive：创建响应式对象，可以用于对象或数组
## 12、vue3生命周期？
1、创建阶段：
    - beforeCreate
    - created
2、设置阶段：
    - setup
3、挂载阶段
    - beforeMount
    - onBeforeMount
    - mounted
    - onMounted
4、更新阶段
    - beforeUpdate
    - onBeforeUpdate
    - updated
    - onUpdated
5、卸载阶段
    - beforeUnmount
    - onBeforeUnmount
    - unmounted
    - onUnmounted

## 13、v-if和v-show的区别？
1、从DOM层面看：`v-if`是销毁/重建，`v-show`是隐藏/显示
2、从性能层面看：`v-if`的切换成本较高，`v-show`的切换成本较低
3、从内存层面看：`v-if`会占用更多的内存，`v-show`不会占用内存

## 14、nextTick原理？
- vue更新DOM是异步的
- nextTick在DOM更新完成后执行
- 内部使用Promise、MutationObserver、setImmediate等方法实现
- 当DOM更新完成后，会触发`nextTick`回调函数