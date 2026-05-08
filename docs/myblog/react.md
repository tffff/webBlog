# react 探索

`react` 灵活性比 `vue` 好，大型复杂项目还是建议使用 `react`

## React(v16.8 以前)

### 挂载阶段

- `construcror`

  初始化操作 state，this 绑定

- `UNSAFE_componentWillMount`

  组件即将被挂载，render 之前调用，只会调用一次，很少使用，setState 不会引起重新渲染，使用同步的 setState 不会触发额外的 render 处理，可能会产生副作用，订阅

- `render`

  唯一必要方法，返回一个 react 元素(state,props),不负责组件的实际渲染工作，只是返回一个 UI 的描述

  > 必须是一个纯函数，在这里不能改变 state、setState，不能执行任何有副作用的操作

  **作用：**

  - 计算 props/state 返回对应的结果
  - `React.createElement` jsx 转化为 vDOM 对象模型

- `componentDidMount`

  1. 组件挂载到 dom 后触发，只会调用一次，获取到真实的 dom,
  2. 可以在这个生命周期里面向服务端发送请求，
     - 可以报销获取到数据时，组件已经处于挂在状态，直接操作 dom,初始化第三方库
     - 只会调用一次，不会发送多余的数据
  3. setState 引起组建重新渲染

### 更新阶段

- `componentWillReceiveProps(nextProps)`

  只在 props 改变才会引起组件的更新,只要父组件的 render 函数被调用，无论父组件的传给子组件的 props 有没有改变，都会触发 `shouldComponentUpdate`

- `shouldComponentUpdate`

  通知组件是否更新，有权利阻止更新，尽量遵循默认行为，状态改变组件就会被重新渲染，要求必须有返回结果，true 就是渲染，false 就是不渲染，**减少组件不必要的渲染，提高性能**

- `componentWillUpdate(nextProps,nextState)`

  可以作为组件更新发生前的执行某些工作的地方,一般很少用，不能调用 setState

- `render`

- `conponentDidUpdate(preProps,preState)`

  更新完成调用，有机会来操作 dom,判断是否发送网络请求，很容易造成死循环

### 卸载阶段

- `componentWillUnmount`

  取消网络请求，卸载定时器，移除事件监听等

### 错误处理阶段

- `componentDidCatch(err,info)`

## React(v16.8 以后)

为什么要使用？代码更加简洁，上手更加简单，开发体验比较好

- `useState` 在函数组件内部创建了一个当前函数组件的装填，并且提供了可修改的方法

  ```js
  //useState可以接受任意类型
  useState(() => {
    //处理逻辑
    return;
  });
  ```

- `useEffect` 总会执行一些副作用操作

```js
//相当于componentDidMount ,componentDidUpdate,componentWillUnmount,第二个参数是react的依赖props,state
useEffect(() => {
  //相当于卸载
  function clear() {}
  return clear;
}, []);
//一般是不需要同步的，如果需要同步使用userLayoutEffect
```

- `useContext` 解决爷孙之间传值,解决组件之间状态共享问题

  ```js
  import React, {
    useState,
    useMemo,
    useCallback,
    createContext,
    useContext,
  } from 'react';
  import './style.css';

  const context = createContext({});

  //顶层组件
  function ContextProbider({ children }) {
    const [count, setCount] = useState(10);
    const constVal = {
      count,
      setCount,
      add: () => setCount(count + 1),
      reduce: () => setCount(count - 1),
    };
    //context提供一个自带的provider的属性
    return <context.Provider value={constVal}>{children}</context.Provider>;
  }

  //子组件
  const ChildComponent = React.memo(() => {
    const { count = 0, add } = useContext(context);
    return <div onClick={add}>这是子组件{count}</div>;
  });

  export default function App() {
    return (
      <div>
        <ContextProbider>
          <ChildComponent />
        </ContextProbider>
      </div>
    );
  }
  ```

  - `useReducer` useState 内部就是根据 useReducer 来实现的，useState 的替代方案

  ```js
  import React, {
    useState,
    useMemo,
    useCallback,
    createContext,
    useContext,
    useReducer,
  } from 'react';
  import './style.css';

  //定义简单的reducer 第一个参数
  const reducer = (state, action) => {
    switch (action.type) {
      case 'add':
        return { ...state, count: state.count + 1 };
      case 'reduce':
        return { ...state, count: state.count - 1 };
      default:
        return state;
    }
  };
  //定义第二个参数createStore() 默认值
  let initState = {
    count: 10,
    name: '111',
  };
  //定义第三个参数 函数，会把第二个参数当做参数执行
  const init = initCount => {
    return { ...initCount };
  };

  function App() {
    const [state, dispath] = useReducer(reducer, initState, init);
    console.log(state);
    return <div onClick={() => dispath({ type: 'add' })}>{state.count}</div>;
  }
  export default App;
  ```

- `useRef` 操作 dom
- `useMemo` 和 `useCallback`

  - `useMemo` 计算结果是 return 回来的值, 主要用于缓存计算结果的值 ,应用场景如: 需要计算的状态
  - `useCallback`   计算结果是函数, 主要用于缓存函数，应用场景如: 需要缓存的函数，因为函数式组件每次任何一个 state 的变化 整个组件都会被重新刷新，一些函数是没有必要被重新刷新的，此时就应该缓存起来，提高性能，和减少资源浪费

  ```js
  //memo 相当于纯函数 防止父组件更新导致子组件也做一些无关的更新, 和PureComponent的功能相似
  //useMemo 类似于memo,但是对函数有更强的封装 返回的是结果
  //useCallback 专门封装函数 防止函数的重复定义导致子组件没有必要的加载,返回的是函数
  ```

- 自定义 hook:可以调用官方的 hook

```js
import React, { useState, useEffect } from 'react';
// 如何模拟数据接口请求功能
export default function useLoadData() {
  const [num, setNum] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      console.log('rrr');
      setNum(2);
    }, 1000);
  }, []);

  return [num, setNum];
}
//使用
const [num, setNum] = useLoadData();
```

## 虚拟 DOM

虚拟 DOM（Virtual DOM）本质上是 JS 和 DOM 之间的一个映射缓存，它在形态上表现为一个能够描述 DOM 结构及其属性信息的 JS 对象

- 虚拟 DOM
  - 虚拟 DOM 是 JS 对象
  - 虚拟 DOM 是对真实 DOM 的描述
  - 虚拟 DOM 的优越之处在于，它能够在提供更爽、更高效的研发模式（也就是函数式的 UI 编程方式）的同时，仍然保持一个还不错的性能
  - 虚拟 dom:批处理，使用 diff 算法，尽可能少的操作 dom,提高渲染效率
- 真实 DOM:操作频繁影响性能

**优点：**

- 虚拟 DOM 主要有批处理和 diff 算法，
- 减少 DOM 操作，提高渲染效率
- 提高了研发体验/研发效率的问题
- 解决了跨平台的问题
- 批量更新

### DOM 操作

操作成本高，大量的计算导致不停的重绘和重排，导致性能变低

### 非 DOM 属性以及如何使用

- `dangerousSetInnerHtml` 可能会导致安全问题
- ref 通过 ref 监视 DOM 元素，不能在函数组件使用，只能在 class 组件使用，拿到子组件的属性
- key 提高渲染性能，帮助 diff 算法识别哪些元素改变了，不要使用 index 作为 key 值

## setState 会立马更新数据吗？

不会，因为 setState 是异步的，批量延迟更新，多个 setState 调用会合并执行一次，因为 setState 的执行顺序是放在一个队列里面的，在一定的时间内会统一处理

异步的主要是在：`onClick`、`onChange`,生命周期中不会同步更新

```js
//基于当前state计算，这样调用能保证拿到的state是最新的
//对象的调用方式不能保持最新，只能在setState的第二个参数里面执行函数
this.setState(state => {
  count: state.count++;
});
```

同步更新主要是在：原生 `js`绑定事件，`setTimeout`

## 受控组件和非受控组件

- 受控组件：依赖状态，默认值实时映射到状态 state,必须使用 onChange 事件，类似于双向绑定，比如表单元素
- 非受控组件：不受控制，操作 dom 使用 ref,很容易于第三方组件结合

## react router

版本：v2、v3、v4、v5,v4/v5 用法和理念基本一致，v2/v3 差异比较大

v4 与 v4 之前的比较：

- v4 属于稳定版本，大多数项目使用，属于动态路由
  - `react-router` 路由库
  - `react-router-dom` 适用于浏览器环境的再封装
  - `react-router-native` 适用于 react-native 环境
  - `react-router-config` 静态路由配置助手
- 之前：静态路由

v5 与 v4 的比较：

- v5 完全兼容 v4,支持 react16，兼容 react，消除了严格模式的警告，适用 `create-react-context` 实现 `context api`
- 稳定性和兼容性，改进与新特性

### 前端路由

原理：检测浏览器 url 路径的变化，截获 url 地址，进行 url 地址匹配

- hash:锚点 `hashchange`，页面刷新的时候不会向后端发送请求

- html5:`histry` 页面刷新的时候会向后端发送请求
  `pushState`,`replaceState`,`onpopstate事件`

### react router 常见概念

- Router 组件： 每个 Router 都会创建一个 history 对象，用来保持当前位置的追踪
  - `web`:`hashRouter` 只处理静态 url,`BrowerRouter` 非静态的站点，要处理不同的 url,`react native`:memeryRouter
- Route 组件：只是一个具有渲染方法的普通 react 组件，路由匹配成功渲染该组件

## redux 流程

js 状态容器，提供可预测化的状态管理，`dispacth` 触发 `action` 然后触发 `reducer` 完成 `state` 的更新

- `action`：发出了什么行为，动作
- `reducer`:为了描述 action 如何改变 state 树
- `store`:仓库

### redux 的好处

单向数据流，解决多级组件、相邻组件传递的问题

### redux 三大原则

- 单一数据源
- `state` 只是只读的，唯一改变方法的就是 action
- `reducer` action 如何改变 reducer,只能使用纯函数执行修改

## immutable

是一种持久化数据。一旦被创建就不会被修改。修改 immutable 对象的时候返回新的 immutable。但是原数据不会改变

## useEffect 为什么不能写在 if 里面？

因为多个 useEffect 使用链表串联的，如果一个 useEffect 写在了 if 里面会导致其他位置的 useEffect 错乱
