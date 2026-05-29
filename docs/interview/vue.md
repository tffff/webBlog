---
title: vue面试汇总
nav:
  title: 面试
  order: 1
group:
  title: 框架
  order: 2
---

## 1、v-for和v-if为什么不能一起使用？

`v-for `优先级高于 `v-if`，会先执行循环，再判断条件，弊端就是会造成性能浪费，哪怕条件不满足依然会先循环所以会造成数据性能浪费问题

👉 实际最佳做法：
- 优先把`v-if`写在外层容器标签上，先判断条件再循环
- 数据层面提前过滤数组，只循环符合条件的数据

> 在 Vue3 中虽然可以一起用，但官方仍然不推荐，因为会影响 diff 性能和代码可读性，最佳实践是通过 computed 进行数据层过滤。

## 2、vue 组件的通信方式
- 父子组件：`props`和`emit`，也可以选择`$ref`
- 兄弟组件：`eventBus`,也可以选择`$parent`
- 祖先与后代：`provide`和`inject`
- 全局：`vuex`、`pinia`

## 3、vuex和pinia的区别? 为什么官方更推荐pinia？
- 无 `mutations`
- 支持 `TS`
- 更轻量
- Composition API 风格

## 4、vue2和vue3的区别
- 响应式：`Vue2` 用 `Object.defineProperty`劫持对象已有属性，无法监听数据下标、length长度以及新增/删除属性的问题，`Vue3` 用 `Proxy`修改了vue2的数据问题
    - 使用框架重写的7个变异方法：push/pop/shift/unshift/splice/sort/reverse，
    - 直接修改下标长度：this.$set(数组、下标、新值)或Vue.set()
    - 整体替换数组
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
 `composable`与普通工具函数有什么区别？
- `composable`是带vue响应式能力的可复用逻辑
- 普通工具函数只是纯计算，不带响应式能力

## 7、shallowRef、shallowReactive 、toRaw、markRaw的区别？
- `shallowRef`只做浅层响应式，只追踪`.value`本身的变更，不会深层代理对象内部属性的变更。
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
- `shallowReactive`只做浅层响应式，只对对象首层属性做代理，嵌套对象无响应，适用于层级深、仅顶层会变动的大型对象，减少监听开销
- `toRaw`：用来获取响应式对象的原始普通对象，拿到之后就不再具有响应式能力（临时取出原始对象）
- `markRaw`：标记对象为原生对象，永久拒绝响应式劫持，常用与第三方实例，静态大数据、DOM对象，优化性能（永久禁止变成响应式）
 
 ## 8、created和mounted的区别？
 - `created`生命周期钩子
    - created 生命周期钩子在组件实例被创建之后立即被调用，在这个阶段，组件实例已经被创建，但是还没有渲染到DOM中，可以在这个阶段执行一些与数据初始化和逻辑处理相关的任务，但无法访问到已经渲染的DOM元素
    - 通常用于进行数据的初始化、设置初始状态、进行异步请求（比如获取数据）,以及数据准备好后执行逻辑
- `mounted`生命周期钩子
    - mounted 生命周期钩子在组件的模板已经渲染到DOM中之后触发，在这个阶段，可以访问DOM元素，通常用于执行需要访问DOM的任务，例如操作DOM元素、添加事件监听器或者执行与DOM相关的操作
    - 通常用于执行需要等待DOM渲染完成之后才能执行的任务，以确保可以操作已经存在的DOM元素
## 9、Vue2/vue3的父子组件的生命周期执行顺序？
vue2生命周期：
- 加载渲染过程:父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
- 子组件更新过程：父breforeUpdate->子beforeUpdate->子updated->父updated
- 父组件更新过程：父beforeUpdate->父update
- 销毁过程：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

vue3生命周期
- 父 setup->父 beforeCreate->父 created->父 beforeMount->子 setup->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted
## 10、watch和computed的区别？
- 缓存特性：`computed`有缓存，依赖值不变就不重新计算，`watch`无缓存，数据一变立刻执行
- 执行方式：`computed`只能同步执行 不能写异步，`watch`支持异步执行
- 使用场景：需要依赖数据算出新值，页面直接渲染用`computed`,数据变化后做业务逻辑、请求接口用`watch`


## 11、vue3中ref和reactive的区别？
- `ref`：创建响应式数据，只能用于单个值，不能用于对象或数组,`ref` 也可以包裹对象(`ref`内部会用 `reactive`处理对象)
    - 基本类型无法被`Proxy`劫持，依靠`.value`字段实现监听
- `reactive`：创建响应式对象，可以用于对象或数组

## 12、vue3生命周期？
1、创建阶段：
- `beforeCreate`
- `created`

2、设置阶段：
 - `setup`
 
3、挂载阶段
- `beforeMount`
- `onBeforeMount`
- `mounted`
- `onMounted`

4、更新阶段
- `beforeUpdate`
- `onBeforeUpdate`
- `updated`
- `onUpdated`

5、卸载阶段
- `beforeUnmount`
- `onBeforeUnmount`
- `unmounted`
- `onUnmounted`

## 13、v-if和v-show的区别？
1、从DOM层面看：`v-if`是销毁/重建，`v-show`是隐藏/显示

2、从性能层面看：`v-if`的切换成本较高，`v-show`的切换成本较低

3、从内存层面看：`v-if`会占用更多的内存，`v-show`不会占用内存

## 14、nextTick的作用和使用场景？
`vue`是异步更新DOM,修改数据之后不会立刻更新DOM,`$nextTick`就是等DOM页面彻底渲染更新完成之后再执行回调函数

**使用场景**
修改数据之后，立刻想要操作DOM、获取DOM元素宽高、获取表单焦点都必须放在`nextTick`里面执行

## 15、vue3对数组主要的修改有哪些？
1、使用 `Proxy` 替代 `Object.defineProperty`

2️、不再需要重写数组方法

3️、支持直接通过索引、`length` 修改数组并触发更新

4️、所有数组操作天然响应式，无需 `$set`

## 16、使用v-for的时候不使用key可以吗？可以使用index做为key？
- key的作用：key是元素唯一标识，帮助虚拟DOM做diff对比，精准识别新旧节点，避免DOM复用错乱，提升渲染效率
- 为啥不推荐用index当key：数组增删、排序时，index序号会重新变动，导致diff算法错误复用DOM,引发数据渲染错乱、表单数据错位等问题
仅静态纯展示。无增删改查的简单列表可以临时使用index,业务动态列表优先使用唯一id


## 17、封装组件是怎么封装的？
- 封装组件时，我会先明确组件职责，

- 通过 `props` 接收数据，`emits` 向外通知事件，

- 内部状态自己管理，

- 使用 `slot` 提高扩展性，

- 保证组件高内聚、低耦合、可复用。

👉 *给个封装`Echarts`的例子*

- 我封装 `ECharts` 组件时，会把初始化、`resize`、销毁统一放在组件内部，resize使用`ResizeObserver / window.resize`

- 通过 `props` 接收 `option`，

- 在 `onMounted` 初始化实例，

- 用 `watch` 监听 `option` 变化调用 `setOption`，

- 在 `onUnmounted` 销毁实例，

- 页面只负责传配置，不关心 `echarts` 细节。



## 18、说说vue2和vue3的生命周期具体有哪些区别，平时开发常用哪些钩子？
`vue3`相比`vue2`新增了`setup`入口函数，作为组合式api起点

生命周期名称也做了调整，`Vue2`的`beforeDestory`改成了`Vue3`的`beforeUnmount`,`destory`改成了`onUnmounted`

平常日常开发主要是使用`onMounted`,页面DOM渲染完成后用来请求接口、初始化数据、日常项目里面用的最多

## 19、`setup()`和`<script setup>`区别，setup执行时机、参数、返回值规则，以及setup里面为什么不能用this?
👉 `setup()`和`<script setup>`区别

无需手动`return`变量/方法，组件、指令自动注册，支持顶层`await`,代码更简洁

与普通`setup`区别：
- 普通`setup`是函数，需要手动暴露变量，语法糖自动暴露
- 语法糖无`this`,通过`defineProps`/`defineEmits`接收参数、定义事件

👉 对比

- 执行时机
    因为`setup`执行的时机是最早，在组件实例还没有创建完成之前就运行了，此时`this`还不存在，所以`setup`内部无法使用`this`
- 参数
    接收两个参数：`props`、`emits`
    - `props`：组件的属性，组件外部通过`props`传递数据给组件内部
    - `emits`：组件的事件，组件内部通过`emits`触发事件给组件外部
- 返回值规则
    - 返回对象：对象内属性/方法可以直接在模板中使用
    - 返回渲染函数：可直接自定义渲染内容
    - 无返回值：模板无法访问`setup`内部定义的变量/方法

执行顺序是`setup`->`beforeCreate`->`created`

## 20、Vue组件中的data为什么必须写成函数形式？
因为组件会被多次复用，如果`data`写成对象，那么所有组件实例会共用同一个对象，数据会互相污染

写成函数，每次创建组件都会创建返回一个全新的对象，每个组件拥有自己独立的数据作用域，互不干扰

## 21、vue插槽有几种，分别怎么用？
1、默认插槽：`<template></template>`

2、具名插槽：`<template slot="header"></template>`

3、作用域插槽：`<template #default="{ item }">{{ item }}</template>`

**使用场景**

1、默认插槽：用于在组件内部渲染默认内容

2、具名插槽：用于在组件内部渲染具名内容

3、作用域插槽：用于在组件内部渲染作用域内容

## 22、vue如何实现路由懒加载？
路由懒加载就是把路由组件拆分打包，用到时再加载，减少首屏加载体积，写法用es6的`import`语法实现
```js
const Home = () => import('@/views/Home.vue')
```
配置路由时引入即可，Vue3搭配Vite也同样适用，能够有效优化首屏加载速度。


## 23、vue2/vue3双向数据绑定原理以及优缺点？
- vue2 : `Object.defineProperty`劫持对象属性
    - 仅能监听已有属性的读取和修改，无法监听属性新增、删除
    - 数组无法监听下标赋值、长度变更，只能靠重写7个原型方法临时兼容
    - 需要递归遍历对象所有属性做劫持，深层对象初始化性能开销高
    - 不支持`Map`/`Set`等集合类型
- vue3 : `Proxy`是劫持整个目标对象
    - 可以拦截属性的新增、删除、修改、读取等操作
    - 原生支持数据下标、长度变更，无需额外重写数组方法
    - 原生兼容`Map`/`Set`等集合类型
    - 结合`Reflect`对象，实现更完善的拦截操作

双向数据绑定本质：数据劫持+发布订阅模式

## 24、组合式API和选项式API的区别，分别适合什么场景？
- 选项式API：`data`、`methods`、`computed`等分开写，
    - 优点：简单、上手快，结构清晰
    - 缺点：同一业务逻辑分散在各个选项里，不好维护，大项目代码杂乱，复用逻辑复杂，适用于小型项目
- 组合式API:`setup`里面集中写逻辑
    - 相同业务逻辑集中放一起，可读性极强
    - 方便抽离公共逻辑Hooks复用
    - 完美适配ts,类型友好
    - 代码灵活，自由度更高，适合中大型项目
## 25、vue3生命周期钩子说几个，对应作用？
- `setup`:组合式API入口，早于所有的生命周期，初始化逻辑，定义响应式数据，没有`this`指向
- `onBeforeMount`:挂载前，DOM没有生成
- `onMounted`:挂载完成后，DOM已经生成
- `onBeforeUpdate`:更新前，DOM已经生成
- `onUpdated`:更新完成后，DOM已经生成
- `onBeforeUnmount`:卸载前，DOM已经生成
- `onUnmounted`:卸载完成后，DOM已经销毁

## 26、vue3怎么封装全局组件？
单个全局组件在`main.js`用`app.component`注册,项目多用批量自动注册，局部组件直接引入使用

## 27、watch和watchEffect的区别？
- 执行逻辑：
    - `watch`需要手动声明监听目标，数据变化才触发回调，默认初始化不执行
    - `watchEffect`会自动追踪函数内所有响应式依赖，初始化立即执行一次，依赖变化就重新执行
- 参数与能力
    - `watch`回调能获取新值、旧值,支持深度监听、立即执行配置
    - `watchEffect`没有新旧值，逻辑更简洁，但是无法区分到底是哪个值变化触发的更新
- 使用场景
    - 需要精细控制、拿到新旧值、监听明确数据变化用`watch`
    - 依赖较多，逻辑随依赖自动联动，无需区分变化来源用`watchEffect`

## 28、vue3怎么实现响应式+diff完整更新流程？
一句话总览
> 数据变化 → 响应式系统触发 effect → 组件重新执行 render → 生成新的 VNode → patch（Diff）→ 最小化更新真实 DOM

一、整体流程图
```text
数据修改
   ↓
Proxy.set
   ↓
trigger()
   ↓
component update（effect）
   ↓
render() → 新 VNode
   ↓
patch(oldVNode, newVNode)
   ↓
Diff（Fast Diff + LIS）
   ↓
DOM 更新
```
二、第一步：响应式系统（数据 → 更新信号）
1️⃣ 数据是 `Proxy`
```js
const state = reactive({ count: 0 })
state.count++
//触发Proxy.set方法
set(target, key, value) {
  target[key] = value
  trigger(target, key)
}
```
2️⃣ `trigger` 找到谁要更新

Vue3 中：

- 组件渲染函数本身就是一个 `effect`
- `watch` / `computed` 也是 `effect`
```js
trigger(state, 'count')
```
- 找到依赖 `count` 的所有 `effect`
- 组件的 `effect` 函数被加入异步队列，等待执行

三、第二步：异步更新队列（nextTick）
`Vue3` 不会立刻更新 `DOM`

```text
数据变化
   ↓
标记组件为“脏”
   ↓
放入微任务队列（Promise.then）
   ↓
同一事件循环中合并多次更新
```
✅ 避免重复渲染
✅ 提升性能

四、第三步：组件重新 render（生成新 VNode）
```js
setup() {
  return () => h(App)
}
```
- 重新执行 `render()`
- 生成一棵 新的 `Virtual DOM` 树
- 此时还没碰真实 `DOM`

五、第四步：patch（Diff 开始）
```js
patch(oldVNode, newVNode, container)
```
1️⃣ sameVnode 判断
```js
(old.tag === new.tag && old.key === new.key)
```
❌ 不同 → 直接销毁重建

✅ 相同 → 进入精细化 Diff

六、第五步：Vue3 Fast Diff（重点）

1️⃣ 编译期优化（很多人漏讲）

Vue3 在 编译阶段​ 已经做了：

|优化|作用|
|--|--|
|PatchFlag|只更新动态内容|
|Block Tree|只 Diff 动态节点|
|静态提升|静态节点不进 Diff|

👉 所以 Diff 的输入已经非常小

2️⃣ 运行时 Diff（核心）

对 children：
- 跳过前后相同节点
- 构建 source 数组
- 用 LIS（最长递增子序列）
- 从后向前移动 `DOM`

✅ DOM 移动次数 = 最少

七、第六步：真实 DOM 更新

最终只做三类操作：

|操作|场景|
|--|--|
|DOM 移动|节点顺序变化|
|DOM 创建|新增节点|
|DOM 删除|移除节点|

✅ 不重建整棵树

✅ 不无意义更新

👉  一句话总结
> Vue3 的更新流程是：数据通过 Proxy 响应式系统触发依赖更新，组件作为 effect 被调度进入异步更新队列，重新执行 render 生成新的 VNode，然后通过编译期优化（PatchFlag / Block Tree）缩小 Diff 范围，运行时使用 Fast Diff 和最长递增子序列算法最小化 DOM 移动，最终实现高性能更新。

## 29、vue3 diff算法？
👉  总结

- 相同节点判断规则

    `Diff`第一步先判断新旧`VNode`是否为同一节点，核心依据是根据`tag+key`，同时会结合`type`、`shapeFlag`等辅助判断
    - 不是同一节点：直接销毁旧节点，创建并挂载新节点
    - 是同一节点：保留`DOM`节点，递归对比节点属性、子节点

- vue2子节点`Diff`优化

    双端`Diff`(收尾指针)针对数组类型的子节点列表，设置头尾两队指针，分四轮交叉对比：旧头&新头、旧尾&新尾、旧头&新尾、旧尾&新头，根据对比结果移动DOM，优先复用位置相近的节点

    若四轮匹配失败，则通过key在旧节点集中查找可复用节点，最终完成节点的增、删、移操作
- vue3 `Diff`优化
    - 编译期优化(`PatchFlag / Block Tree`):编译时标记动态节点、动态属性，运行时`Diff`跳过静态节点，只对比标记过的动态内容，缩小对比范围
    - 列表`Diff`:使用`最长递增子序列`，对于无法通过首尾匹配的乱序列表，通过最长递增子序列算出无需移动的稳定阶段，其余节点仅做最少次数的移动、新增、删除、相比`Vue2`进一步减少`DOM`操作，优化长列表性能

`key` 的作用是帮助 `Diff` 精确定位可复用节点，避免使用 `index` 作为 `key` 以防列表变动导致节点误复用

