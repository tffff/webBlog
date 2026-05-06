---
title: parcel基本使用
date: 2022-01-11 14:22:34
---

# parcel 基本使用

`Parcel` 是一款完全零配置的前端打包器，它提供了 “傻瓜式” 的使用体验，我们只需了解它提供的几个简单的命令，就可以直接使用它去构建我们的前端应用程序了

## 快速上手

这里我们先创建一个空目录，然后通过 `npm init` 初始化一个项目中的 `package.json` 文件

安装 parcel:

```bash
$ npm install parcel-bundler --save-dev
```

这里需要注意 `Parcel` 的 npm 模块名称叫作 `parcel-bundler`

目录结构：

```markdown
.
├── src
│ ├── index.html
│ ├── logger.js
│ └── main.js
└── package.json
```

`index.html` 文件会将是 `Parcel` 打包的入口文件

虽然 `Parcel` 跟 `Webpack` 一样都支持以任意类型文件作为打包入口，不过 `Parcel` 官方还是建议我们使用 `HTML` 文件作为入口。官方的理由是 `HTML` 是应用在浏览器端运行时的入口

index.html 的代码：

```html
<!-- ./src/index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Parcel Tutorials</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

main.js 和 logger.js 的代码：

```js
// ./src/main.js
import { log } from './logger';
log('hello parcel');

// ./src/logger.js
export const log = msg => {
  console.log('---------- INFO ----------');
  console.log(msg);
};
```

然后执行`npx parcel src/index.html`,会生成 dist 文件夹，同时我们发现 `Parcel` 这个命令不仅仅帮我们打包了应用，还同时开启了一个开发服务器，这就跟 `Webpack Dev Server` 一样

以上就是基本用法

## 模块热替换

`module.hot.accept`不需要传参数，只需要传一个回调就可以实现，比 Webpack 中的用法要简单很多

```js
//main.js
import { log } from './logger';
log('hello parcel');
// HMR API
if (module.hot) {
  module.hot.accept(() => {
    console.log('HMR～');
  });
}
```

## 自动安装依赖

除了热替换，Parcel 还支持一个非常友好的功能：自动安装依赖。试想一下，你正在开发一个应用的过程中，突然需要使用某个第三方模块，那此时你就需要先停止正在运行的 Dev Server，然后再去安装这个模块，安装完成过后再重新启动 Dev Server。有了自动安装依赖的功能就不必如此麻烦了

在文件保存过后，Parcel 会自动去安装刚刚导入的模块包，极大程度地避免手动操作

## 其他类型资源加载

Parcel 同样支持加载其他类型的资源模块，而且相比于其他的打包器，在 Parcel 中加载其他类型的资源模块同样是零配置的

例如添加 css 文件是不需要做其他操作的，会自动打包

## 动态导入

```js
//main.js
import { log } from './logger';
log('hello parcel');
import('jquery').then($ => {
  $(document.body).append('<h1>Hello Parcel</h1>');
});
```

## 生产模式打包

执行命令：

```bash
$ npx parcel build src/index.html
```

相同体量的项目打包，`Parcel` 的构建速度会比 `Webpack` 快很多。因为 `Parcel` 内部使用的是多进程同时工作，充分发挥了多核 `CPU` 的性能

## 总结

- 真正做到了完全零配置，对项目没有任何的侵入；
- 自动安装依赖，开发过程更专注；
- 构建速度更快，因为内部使用了多进程同时工作，能够充分发挥多核 CPU 的效率。

但是更多的人还是会选择 webpack，原因可能是：

- Webpack 生态更好，扩展更丰富，出现问题容易解决；
- 随着这两年的发展，Webpack 越来越好用，开发者也越来越熟悉。
