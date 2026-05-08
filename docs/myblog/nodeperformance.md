---
title: NodeJS性能优化
date: 2022-01-31 13:44:20
---

## 内存泄漏

程序的运行需要内存，只要程序提出要求，操作系统或者运行时就必须供给内存，对于持续运行的服务进程，必须及时释放不再用到的内存，否则内存占用越来越高，轻则影响系统性能、重则导致进程奔溃，不再用的到的内存没有及时释放，就叫内存泄漏

### 内存泄漏的表现

- 应用运行速度越来越慢
- 触发其他类型的失败
- 应用迟早会奔溃
- 浏览器端也会发生内存泄漏，只不过浏览器只针对一端，会造成网页的卡顿

## 压力测试工具

- `wrk` 在 github 下载
- -t 需要模拟器的线程数
- -c 需要模拟的连接数
- -timeout 超时的时间
- -d 测试的持续时间
- `./wrk -t12 -c400 -d30s http://127.0.0.1:4000/`
  最后一句话的意思是：用 12 个线程模拟 100 个连接，30s 内，一般线程数不宜过多，核数的 2 到 4 倍足够
- `memeye`

```js
const http = require('http');
const memeye = require('memeye');
memeye();
let leakArray = [];
const server = http.createServer((req, res) => {
  if (req.url == '/') {
    leakArray.push(Math.random());
    console.log(leakArray);
    res.end('hello world');
  }
});

server.listen(3000);
```

会出现一个性能检测页面

### 通过 gc 来看内存的消耗

```js
global.gc();
//返回当前node的使用情况
console.log(process.memoryUsage())

// let map=new Map()
// let key=new Array(5*1024*1024)
// map.set(key,1)

// global.gc();
// console.log(process.memoryUsage())

//回收key  第一种
// map.delete(key);
// key=null;
// global.gc();
// console.log(process.memoryUsage())

//第二种
const wm=new WeakMap();
let key=new Array(5*1024*1024);
wm.set(key,1);
key=null;
global.gc();
console.log(process.memoryUsage())

//手动让node能够执行gc
//终端里面执行 node --expose-gc demo3.js
//结果如下
{
  rss: 19394560,
  heapTotal: 4644864,
  heapUsed: 1813184,
  external: 766830,
  arrayBuffers: 9382
}
{
  rss: 62304256,
  heapTotal: 49217536,
  heapUsed: 44196448,  //主要是看这一项
  external: 924290,
  arrayBuffers: 9382
}
```

输出结果

- memwatch+heapdump 查找内存泄漏工具

## 编码规范

### 队列消费不及时

这是一个不经意产生的内存泄漏，队列一般在消费者-生产者模型中充当中间人的角色，当消费大于生产时没有问题，当生产大于消费时，会产生堆积，就容易发生内存泄漏

### 内存泄漏

闭包一定会产生内存泄漏

## 同构化原理

### spa(单页面应用)

vue.js -> vue.router.js -> main.js -> app.js -> vue 组件 -> 数据 -> js 交互
切页面方便 a/b->c/d（变化的部分内容）

### mpa(多页面应用)

可见可操作 ，例如 index.html 直接显示 a 元素

bjgpipe main.div->chunk->chunk

-加载 js 代理 a 元素
