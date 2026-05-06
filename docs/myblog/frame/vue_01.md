---
title: vue2源码解析
date: 2023-01-11 10:32:20
---

看源码先看测试用例，反推功能是怎么实现的。

## 整体架构

```
vue-dev
│ -- benchmarks
│ -- dist        打包出来的东西
│ -- examples    测试的例子
│ -- flow        语法的规范
│ -- packages    周边打包的东西
│ -- scripts     编译出来的东西
│ -- src
│  │-- compiler
│  └───
│ -- test        测试用例
└─── types       TS规则校验
```

.vue 结尾的文件通过打包编译，里面进行了词法分析、语法分析、构建 AST、转移 js

## v-model 双向绑定原理

### 介绍

`v-model` 实现双向绑定的语法糖，常用于表单与组件之间的数据双向绑定.

> `v-model` 就是`@input` 和 `v-on` 的的语法糖

### 表单实现双向绑定

1. 原理 分两步骤 `v-bind`绑定一个`value`属性,`v-on`指令给当前元素绑定`input`事件 可看出`v-model`绑定在表单上时，`v-model`其实就是`v-bind`绑定`value`和`v-on`监听`input`事件的结合体

```js
v-model = v-bind:value + v-on:input
```

2. 实现用 `v-bind:value + v-on:input`来模拟实现 `v-model`

```js
   <input type="text" :value="username" @input="username = $event.target.value" />
```

例子解释： 通过 `v-bind:value`绑定 `username` 变量，每次输入内容的时候触发 `input` 事件 通过事件对象参数 `event.target.value` 获得输入的内容，并且把这个内容赋值给 `username` 此时更改 `username` 时 `input` 输入框会变化，更改 `input` 输入框时 `username` 变量会变，从而实现了 `v-model` 的双向绑定功能

### 组件上的双向绑定

`v-model` 绑定在组件上的时候做了以下步骤 在父组件内给子组件标签添加 `v-model` ，其实就是给子组件绑定了 `value` 属性 子组件内使用 `prop` 创建 创建 `value` 属性可以拿到父组件传递下来的值，名字必须是 `value`。 子组件内部更改 `value` 的时候，必须通过 `$emit` 派发一个 `input` 事件，并携最新的值 `v-model` 会自动监听 `input` 事件，把接收到的最新的值同步赋值到 `v-model` 绑定的变量上

### 实例

```js
//父组件
<template>
  {{ value }}
  <son-test :options="options" v-model="value"></son-test>
</template>

<script>
import SonTest from './components/HelloWorld.vue';
export default {
  name: 'fatherTest',
  components: { SonTest },
  data() {
    return {
      value: '选项1',
      options: [
        { value: '选项1', label: '黄金糕' },
        { value: '选项2', label: '双皮奶' },
        { value: '选项3', label: '蚵仔煎' },
        { value: '选项4', label: '龙须面' },
        { value: '选项5', label: '北京烤鸭' },
      ],
    };
  },
  watch: {
    // 下面这个监听只是为了打印显示
    value(newValue) {
      console.log('value 值发生改变：', newValue);
    },
  },
};
</script>

<style scoped></style>
```

子组件

```js
//子组件
<template>
  <select v-model="sonValue" placeholder="请选择">
    <option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></option>
  </select>
</template>

<script>
export default {
  name: 'sonTest',
  // props 下定义父组件传递给子组件的数据
  props: {
    // 父组件使用子组件时通过 :options 传递给子组件
    options: {
      type: Array,
      default: [],
    },
    value: {
      type: String,
      default: '',
    },
  },
  model: {
    // 需要双向绑定的 props 变量名称，也就是父组件通过 v-model 与子组件双向绑定的变量
    prop: 'value',
    // 定义由 $emit 传递变量的名称
    event: 'newValue',
  },
  data() {
    return {
      // 子组件不能修改 props 下的变量，所以定义一个临时变量
      sonValue: this.value,
    };
  },
  watch: {
    // 监听 sonValue 临时变量，如果临时变量发生变化，那么通过 $emit 将新的值传递给父组件
    sonValue(value) {
      console.log('子组件下拉框值发生改变：', this.sonValue);
      // 【注意】newValue x需要和 model.event 定义的值一致
      this.$emit('newValue', this.sonValue);
    },
  },
};
</script>

<style scoped></style>
```

## vue 的整体流程

## vue 运行时的优化
