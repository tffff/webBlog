# vue2 知识点

## 遍历 v-for

### 数组遍历

```js
<template>
  <div class="hello">
    <ul>
      <li v-for="(item,index) in list">{{index+1}}、{{item.title}}</li>
    </ul>
  </div>
</template>

<script type='javascript'>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      list:[{title:'测试数据1'},{title:'测试数据2'}]
    }
  }
}
</script>

<style scoped>

</style>

```

### 对象遍历

- `value` 是值
- `key` 是键
- `index` 是序号

```js
<template>
  <div class="hello">
    <ul>
      <li v-for="(value,key,index) in obj">{{value}}、{{key}}、{{index}}</li>
    </ul>
  </div>
</template>

<script type='javascript'>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      obj:{
        name:'vue',
        age:5
      }
    }
  }
}
</script>

<style scoped>

</style>

```

<Alert>注意：使用 `v-for`时要带上`:key`属性 ,`v-for`也可以使用计算属性`computed`</Alert>

`example`:

```js
<template>
  <div class="hello">
    <input type='radio'  v-model="type" value="boy"/>男生
    <input type='radio'  v-model="type" value="girl"/>女生
    <ul>
      <li v-for="(item ,index) in filterData">{{item.name}}</li>
    </ul>
  </div>
</template>

<script type='javascript'>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      type:'all',
      user:[
        {name:'小明',sex:'boy'},
        {name:'小强',sex:'boy'},
        {name:'小丽',sex:'girl'},
        {name:'小梅',sex:'girl'}
      ]
    }
  },
  computed:{
    filterData(){
      if(this.type=='all'){
        return this.user;
      }else{
        return this.user.filter(v=>v.sex===this.type)
      }
    }
  }
}
</script>

<style scoped>

</style>

```

- 数组更新：
  - `$set`:实例方法
  - `push`
  - `pop`
  - `shift`
  - `unshift`
  - `spice`
  - `sort`
  - `reverse`
- 对象更新：
  - `Object.assign`:可以增加多个值

## 计算属性 computed 和侦听属性 watch

计算属性`computed`和侦听属性`watch`都可以实现缓存，方法不能实现缓存。

一个功能既可以使用`watch`实现，也可以使用`computed`实现，则优先使用计算属性`computed`

- 一对多：`computed`
- 多对一：`watch`

如果不希望有缓存则可以用方法来替代

### computed

支持缓存，只有依赖数据发生改变，才会重新进行计算

```js
<template>
  <div class="hello">
    <p>{{fullName}} </p>
    姓：<input v-model='firstName'>
    名：<input v-model='lastName'/>
  </div>
</template>

<script type='javascript'>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      firstName:'tian',
      lastName:'xiaoxiao'
    }
  },
  computed:{
    fullName(){
      return this.firstName+' '+this.lastName
    }
  }
}
</script>

<style scoped>

</style>

```

### watch

不支持缓存，数据变，直接会触发相应的操作

当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的

## 事件修饰符

- .stop
- .self
- .once
- .prevent

## 按键修饰符

- .enter
- .tab
  -.esc
  -.up
  -.left
  -.right

## 组件传值

- 父传子 `props`
- 子传父 `$emit`
- 兄弟组件 `bus中央事件总线`
- `vuex`

## 插槽 slot

- 普通插槽
- 具名插槽
  v-slot 必须作用在 template 上
- 作用域插槽
  让插槽内容可以访问到子组件才有的数据

## 动态组件 component

<component is=""/>

## 组件缓存：`keep-alive`

keep-alive 用于保存组件的渲染状态

使用了 keep-alive 的之后可以使用的生命周期：

- `activated` 页面处于激活状态时调用,页面第一次进入的时候，钩子触发的顺序是`created`->`mounted`->`activated`
- `deactivated`页面退出的时候会触发`deactivated`，当再次前进或者后退的时候只触发`activated`

## 路由

- 动态路由

- 嵌套路由
- 命名路由
- 编程式导航
- 路由传参
- 路由守卫
  - 全局钩子函数 beforeEach(to,from,next)、next()、next(false)、next('/login')
  - 权限控制
  - 组件内钩子函数
    - beforeRouteEnter(to,from,next) 实例没有被创建
    - beforeRouteUpdate
    - beforeRiuteleave

## vuex

### 什么是 vuex

状态管理,可追踪、可预测,仓库

### 为什么用 vuex

没有关系组件之间的传值导致管理比较混乱，所以用 vuex 管理，它不是必须的，适合大型项目

### 安装配置

```bash
# 安装
npm install vuex --save
# 配置
/src/store/index.js
```

```js
//vue2 store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const moduleA = {
  state: {
    name: "m1",
  },
  mutations: {},
  getters: {},
};
const moduleB = {
  state: {
    name: "m2",
  },
  mutations: {},
  getters: {},
};

export default new Vuex.Store({
  state: {
    count: 10,
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  }, //状态
  getters: {
    //计算属性
    filterList: (state) => {
      return state.list.filter((item) => item % 2 === 0);
    },
  },
  //对数据的更改,唯一改变数据的方式，不允许有异步操作
  mutations: {
    add(state) {
      //可以提供额外的参数
      state.count++;
    },
    reduce(state) {
      state.count--;
    },
    //使用 this.$store.commit('add')，推荐使用传对象的方式this.$store.commit('add',{num:100})
    //添加之前state没有设置的key值
    addNewState() {
      //下面是相当于新增一个键值
      Vue.set(state, "newState", "我是新属性");
      //下面相当于替换一个新的state对象
      this.replaceState({ ...state, newState: "我是新属性" });
    },
    changeCount(state, newState) {
      return (state.count = newState.count);
    },
  },
  actions: {
    //使用 this.$store.dispatch('modified')
    modified({ commit }) {
      commit("changeCount", await getData());
    },
  }, //异步处理
  modules: {
    //声明模块
    m1: moduleA,
    m2: moduleB,
  },
});
```

### api

- `state` 和 `mapState`
  可以使用`this.$store.state`来获取数据，当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余，可以使用 `mapState` 来便于我们使用
  ```js
  computed:{
    ... mapState([
      // 映射 this.count 为 store.state.count
      "count",
    ]);
  }
  //可以使用函数
  computed:{
    ... mapState(['count':(state)=>{return state.count}]);
  }
  ```
- `getter`和`mapGetter` 主要是对状态的处理
  ```js
  //正常使用
  computed:{
    ... mapGetters([
      "filterList",
    ]);
  }
  //取别名
  computed:{
    ... mapGetters([{num:'filterList'}]);
  }
  ```
- `mutations`和`mapMutations` 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，必须是同步函数

  ```js
  mutations:{
    increment (state) {
      // 变更状态
      state.count++
    }
  }

  ```

- `action`和`mapAction` 异步操作

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}

```
