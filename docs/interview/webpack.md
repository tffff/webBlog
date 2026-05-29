## 1、webpack的作用
webpack是一个现代的前端模块打包工具，用于构建和优化web程序的前端资源，包括js/css/html等。主要目的是将项目的所有依赖（模块、资源文件）打包到一个或多个最终的静态文件中，以便于在浏览器加载，改善前端开发的工作流程，提高代码的可维护性和性能，解决模块化。资源管理、性能优化和自动化等多个关键问题

## 2、webpack常用Loader
- `Babel Loader`：用于将新版javascript语法转换为旧版语法，兼容旧版浏览器和环境
- `CSS Loader`：处理css文件，使其能够被打包到应用程序中，可以配合其他Loader使用，如`Sass Loader`、`PostCSS Loader`等,以处理css导入、模块化等问题
- `Style Loader`：将css样式加载到页面中，通常与css Loader一起使用
- `File Loader`：处理文件资源（如图片、字体等），将他们复制到输出目录，并返回文件路径
- `URL Loader`：与上面的`File Loader`类似，但是将文件资源转换为base64编码的字符串，而不是复制到输出目录
- `Sass/SCSS Loader`：处理Sass/SCSS文件，将其转换为CSS文件
- `Less Loader`：处理Less文件，将其转换为CSS文件
- `PostCSS Loader`：处理CSS文件，添加前缀、压缩、变量替换等操作
- `Image Loader`：处理图片文件、包括压缩、优化和Base64编码等
- `TypeScript Loader`：处理TypeScript文件，将其转换为JavaScript文件
- `Vue Loader`：用于加载和解析vue.js单文件组件，包括模板、脚本和样式
- `EsLint Loader`：与Eslint集成，用于在构建过程中进行代码质量检查，查找潜在的问题并确保代码规范

## 3、webpack常用Plugin
- `HtmlWebpackPlugin`：用于生成HTML文件，将打包后的资源文件嵌入到HTML中
- `MiniCssExtractPlugin`：将css文件从js中提取出来，生成独立的css文件，方便缓存和加载
- `CleanWebpackPlugin`：在每次构建前清理输出目录，确保构建结果是最新版本
- `CopyWebpackPlugin`：用于复制文件或目录到输出目录，如静态资源、字体、图片等
- `DefinePlugin`：用于在构建时定义全局常量，如环境变量、版本号等，方便在代码中使用
- `HotModuleReplacementPlugin`：用于在开发环境下实现模块热替换，无需刷新页面即可更新代码
- `ProvidePlugin`：用于在构建时提供全局变量，如jQuery、lodash等，避免在每个模块中重复引入
- `BundleAnalyzerPlugin`：用于分析打包后的资源文件，帮助优化资源加载性能和用户体验

## 4、Loader和Plugin的区别
- `Loader`：用于处理资源文件，使其能够成为模块
- `Plugin`：用于执行构建过程中的各种任务和优化、扩展`Webpack`的功能

## 5、webpack分包案例
尽量安改动频率区分，利用浏览器缓存
- `vendor`：第三方lib库，基本不会改动，除非依赖版本升级
- `common`：业务组件代码的公共部分抽取出来，改动较少
- `entry`：不同页面entry里业务组件代码的差异部分，会经常改动

## 6、webpack和vite的区别
- webpack是一个打包工具，静态构建，在项目工程化、依赖、打包、构建等过程发挥作用
- vite是一个更上层的工具链方案，对标的是（webapck+针对web的常用配置+webpack-dev-server），旨在提供快速的开发体验

