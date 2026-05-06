<!--
 * @Author: tf
 * @Date: 2021-03-26 11:15:58
 * @LastEditTime: 2021-03-26 11:29:49
 * @Description: vscode技巧
-->

## VScode 技巧

### 场景一

一般我们在 react 项目里面使用了别名之后，就会发现通过快捷键点击链接进入不了页面上面引入的组件链接，那么下面就要针对这种方法进行解决，既在项目下面新建`jsconfig.json`文件

#### jsconfig.json 是什么？

功能简单说明：`jsconfig.json`有了它，可以对文件目录检索做智能提示，再也不用两眼发酸的丑目录写引入文件的地址了，一路上下键选择回车搞定。

如果你的项目中有一个 jsconfig.json 文件的话,这个文件的配置可以对你的文件所在目录下的所有 js 代码做出个性化支持。

jsconfig.json 的配置是 tsconfig.json 的子集。

#### 实际使用

```json
{
  "compilerOptions": {
    "jsx": "react",
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

- `compilerOptions` : 不要被 `compilerOptions` 搞糊涂了。 这个属性之所以存在，是因为 `jsconfig.json` 是 `tsconfig.json` 的后代，后者用于编译打字稿

  | 属性                         | 描述                                                                                                                          |
  | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
  | nolib                        | 不要包含默认的库文件(lib.d.ts)                                                                                                |
  | target                       | 指定要使用的默认库(lib.d.ts)。值为 "es3", "es5", "es6", "es2015", "es2016", "es2017", "es2018", "es2019", "es2020", "esnext". |
  | module                       | 在生成模块代码时指定模块系统。值为“ amd”、“ commonJS”、“ es2015”、“ es6”、“ esnext”、“ none”、“ system”、“ umd”               |
  | moduleResolution             | 指定如何解析导入模块。值为“node”和“classic”                                                                                   |
  | checkJs                      | 启用 JavaScript 文件的类型检查                                                                                                |
  | experimentalDecorators       | 为提议的 ES 装饰器提供实验支持                                                                                                |
  | allowSyntheticDefaultImports | 允许从没有默认导出的模块进行默认导入。这不影响代码，只是进行类型检查                                                          |
  | baseUrl                      | 解析非相关模块名称的基础目录                                                                                                  |
  | paths                        | 指定相对于 baseUrl 选项计算的路径映射                                                                                         |

- `include` : 您希望排除由构建过程生成的文件(例如，`dist` 目录)。 这些文件将导致建议显示两次，并将减缓智能感知
