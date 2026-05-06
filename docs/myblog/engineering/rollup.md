---
title: rollup基本使用
date: 2022-01-11 14:22:34
---

# rollup 基本使用

`rollup`它的初衷只是希望能够提供一个高效的 ES Modules 打包器，充分利用 ES Modules 的各项特性，构建出结构扁平，性能出众的类库

## 基本使用

新建一个项目

```bash
 ├── src

 │   ├── index.js

 │   ├── logger.js

 │   └── messages.js

 └── package.json

```

文件的代码如下：

```js
// ./src/messages.js
export default {
  hi: 'Hey Guys, I am zce~',
};

// ./src/logger.js
export const log = msg => {
  console.log('---------- INFO ----------');
  console.log(msg);
  console.log('--------------------------');
};

export const error = msg => {
  console.error('---------- ERROR ----------');
  console.error(msg);
  console.error('---------------------------');
};

// ./src/index.js
import { log } from './logger';
import messages from './messages';
log(messages.hi);
```

安装 rollup，并执行

```bash
# 安装
$ npm i rollup --save-dev
# 执行 如果不指定打包路径就会报错 这个执行之后不会生成文件
$ npx rollup ./src/index.js
# 执行之后会生成bundle.js文件
$ npx rollup ./src/index.js --file ./dist/bundle.js
```

创建`rollup.config.js`

```js
// ./rollup.config.js
// 支持的格式有 ['es', 'amd', 'cjs', 'iife', 'umd', 'system']
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es', // 输出格式
  },
};
```

配置了 config 文件之后执行命令

```bash
$ npx rollup --config # 使用默认配置文件
$ npx rollup --config rollup.prod.js # 指定配置文件路径
```
