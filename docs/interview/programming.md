---
title: 编程题（手写系列）
date: 2022-01-04 10:47:10
nav:
  title: 面试
  order: 1
group:
  title: 其他
  order: 1
---

## 1、实现 lodash 的/.get()方法

```js
function sageGet(obj, target) {
  //原本是a[0].b.c[0]->a.0.b.c.0->[a,0,b,c,0]
  const paths = target.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = obj;
  for (let p of paths) {
    result = Object(result)[p];
    if (result === undefined) {
      return undefined;
    }
  }
  return result;
}
//得到如下功能：
let obj = {
  a: [
    {
      b: {
        c: ['c'],
      },
    },
  ],
};

sageGet(obj, 'a[0].b.c[0]'); //return "c"
safeGet(obj, 'a.b.c.c'); // return defined
```

## 2、请实现一个方法`function group(array,n)`,其中第一个参数是一个数组，第二个参数是一个整数，返回一个数组，该数组应该满足如下条件：

```js
var n = 2,
  arr = [1, 2, 3, 4, 5, 6];
var resultArr = group(arr, n);
//此时resultArr为[[1,2],[3,4],[5,6]],arr还是[1,2,3,4,5,6]
//n=3时，resultArr=[[1,2,3],[4,5,6]]
//n=4时，resultArr=[[1,2,3,4],[5,6]]
//n<0时，resultArr=[1,2,3,4,5,6]
//n>arr.length时，resultArr=[1,2,3,4,5,6]

//第一种 for循环实现  时间复杂度O(n)
function group(arr, n) {
  if (n < 0 || n > arr.length) return arr;
  let result = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
}

console.log(group([1, 2, 3, 4, 5, 6], 4));

//第二种 while
function group1(arr, n) {
  let index = 0,
    result = [];
  while (index < arr.length) {
    result.push(arr.slice(index, (index += n)));
  }
  return result;
}
```

## 3、手写一个 new 操作符

首先看一下 new 操作符做了什么？

```js
function User() {
  this.name = 'xiaoming';
  this.age = 20;
}

const user = new User();
console.log(user); //{name:'xiaoming',age:20}
```

1. 首先创建一个空对象

```js
var obj = {};
//or
var obj = new Object();
```

2. 链接该对象到另一个对象上（将该对象的*proto*指向构造函数的的 prototype）

```js
obj._proto_ = User.prototype;
```

3. 把创建的`obj`作为`this`的上下文

4. 判断构造函数的返回值

综合代码验证：

```js
//手写new
function User(name, age) {
  this.name = name;
  this.age = age;
}
function myNew(o, ...args) {
  // 创建对象
  const obj = {};
  // 链接对象
  obj.__proto__ = o.prototype;
  // 绑定this
  let res = o.call(obj, ...args);
  return res instanceof Object ? res : obj;
}
const user = myNew(User, 'tf', 20);
console.log(user);
```

## 4、手写一个 JSON.stringify 和 JSON.parse

## 5、手写一个 call、apply、bind

## 6、手写 js 浅拷贝、深拷贝（由浅入深多种解法）

```js
//浅拷贝
const shallowClone = target => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let key in target) {
      //hasOwnProperty 判断对象是否包含特定的自身（非继承）属性
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = target[key];
      }
    }
    return cloneTarget;
  }
  return target;
};

console.log(shallowClone({ a: 1, b: { c: 2 } }));

//深拷贝--基础版
const deepClone = obj => {
  let cloneObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      cloneObj[key] = deepClone(obj[key]);
    } else {
      cloneObj[key] = obj[key];
    }
  }
  return cloneObj;
};

//深拷贝--加强版
```

## 7、手写一个 instanceOf 原理

因为`instanceOf`只能判断复杂类型，不能判断简单类型，所以只要左边都是简单类型都是`false`

```js
function myInstanceOf(left, right) {
  //这里先用typeof来判断基本数据类型，如果是就返回false
  if (typeof left !== 'object' || left === null) return false;
  //getPrototypeOf是object对象自带的api,能够拿到参数的原型对象
  let proto = Object.getPrototypeOf(left);
  while (true) {
    //循环向下寻找，直到找到相同的原型对象
    if (proto === null) return false;
    if (proto === right.prototype) return true; //找到相同的原型对象就返回 true
    proto = Object.getPrototypeOf(proto);
  }
}

console.log(myInstanceOf(new Number(123), Number)); //true
console.log(myInstanceOf(123, Number)); //false
```

## 8、手写 map 和 reduce

## 9、手写实现拖拽

## 10、使用 setTimeout 实现 setInterval

## 11、手写实现 Object.create 的基本原理

## 12、手写 Promise

## 13、实现数组转树

```js
let input = [
  { id: 1, val: '学校', parentId: null },
  { id: 2, val: '班级1', parentId: 1 },
  { id: 3, val: '班级2', parentId: 1 },
  { id: 4, val: '学生1', parentId: 2 },
  { id: 5, val: '学生2', parentId: 3 },
  { id: 6, val: '学生3', parentId: 3 },
];
function arrToTree(array) {
  let root = array[0];
  let tree = {
    id: root.id,
    val: root.val,
    children: array.length > 0 ? toTree(root.id, array) : [],
  };
  return tree;
}

function toTree(parentId, arr) {
  console.log(arr);
  let children = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].parentId === parentId) {
      children.push({
        id: arr[i].id,
        val: arr[i].val,
        children: toTree(arr[i].id, arr),
      });
    }
  }
  return children;
}

console.log(arrToTree(input));
//结果

let output = {
  id: 1,
  val: '学校',
  children: [
    {
      id: 2,
      val: '班级1',
      children: [
        {
          id: 4,
          val: '学生1',
          children: [],
        },
      ],
    },
  ],
};
```

## 14、装饰器：给一个函数添加装饰器，在不改变原函数的基础上添加逻辑

装饰器写法：

```js
function A() {
  console.log('A');
}

const myDecorator = (fn, execute, obj = window) => {
  let old = obj[fn];
  obj[fn] = function() {
    return execute(old.bind(obj));
  };
  console.log(obj[fn]);
};

myDecorator('A', fn => {
  fn();
  console.log('hello world');
});
A();
```

## 15、用 promise 实现请求并发个数限制？

## 16、手写用 es6 Proxy 如何实现 arr[-1]

```js
const negativeArray = els =>
  new Proxy(els, {
    get: (target, propKey, receiver) => {
      console.log(target, propKey);
      return Reflect.get(
        target,
        +propKey < 0 ? String(target.length + +propKey) : propKey,
        receiver,
      );
    },
  });
const unicorn = negativeArray(['一', '二', '三', '四']);
console.log(unicorn[-1]); //四
```

## 17、实现格式化输出，比如输出 999999999 转换成 999,999,999

```js
function changeNumber(number) {
  let arr = [];
  let str = number + '';
  let count = str.length;
  while (count >= 3) {
    arr.unshift(str.slice(count - 3, count));
    count = count - 3;
  }
  count % 3 !== 0 && arr.unshift(str.slice(0, count % 3));
  return arr.toString();
}
console.log(changeNumber(12345678)); //12,345,678
```

## 18、手写发布订阅模式

```js
class myEventEmitter {
  constructor() {
    // eventMap 用来存储事件和监听函数之间的关系
    this.eventMap = {};
  }
  // type 这里就代表事件的名称
  on(type, handler) {
    // hanlder 必须是一个函数，如果不是直接报错
    if (!(handler instanceof Function)) {
      throw new Error('哥 你错了 请传一个函数');
    }
    // 判断 type 事件对应的队列是否存在
    if (!this.eventMap[type]) {
      // 若不存在，新建该队列
      this.eventMap[type] = [];
    }
    // 若存在，直接往队列里推入 handler
    this.eventMap[type].push(handler);
  }
  // 别忘了我们前面说过触发时是可以携带数据的，params 就是数据的载体
  emit(type, params) {
    // 假设该事件是有订阅的（对应的事件队列存在）
    if (this.eventMap[type]) {
      // 将事件队列里的 handler 依次执行出队
      this.eventMap[type].forEach((handler, index) => {
        // 注意别忘了读取 params
        handler(params);
      });
    }
  }
  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}

const myEvent = new myEventEmitter();
const testHandler = function(params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};
const testHandler1 = function(params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};
myEvent.on('test', testHandler);
myEvent.emit('test', 'newState');

myEvent.on('test1', testHandler1);
myEvent.emit('test1', '111');
```

<Alert type='info'>
>>> 是无符号按位右移运算符。考虑 indexOf 返回-1 的情况：splice方法喜欢把-1解读为当前数组的最后一个元素，这样子的话，在压根没有对应函数可以删的情况下，不管三七二十一就把最后一个元素给干掉了。而 >>> 符号对正整数没有影响，但对于-1来说它会把-1转换为一个巨大的数（你可以本地运行下试试看，应该是一个32位全是1的二进制数，折算成十进制就是 4294967295）。这个巨大的索引splice是找不到的，找不到就不删，于是一切保持原状，刚好符合我们的预期
</Alert>
