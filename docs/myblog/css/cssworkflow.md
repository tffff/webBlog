---
title: CSS工作流
date: 2022-01-19 13:47:10
---

## css 预处理器

处理特定格式源文件到目标 css 的处理程序

- 变量

- 混合(Mixin) Extend
- 嵌套规则
- 运算
- 函数
- Namespaces & Accessors
- Scope
- 注释

## css 后处理器

- css 压缩 clean-css
- 自动添加浏览器前缀 Autoprefixer
- css 更加美观排序 csscomb
- Rework 取代 stylus 后处理器发热
- 前后通吃 PostCSS

### PostCss 值得收藏的插件

- postcss-custom-properties 运行时变量
- postcss-simple-vars 与 scss 一致的变量实现
- postcss-mixins 实现类似 sass 的@mixin 的功能
- postcss-extend 实现类似 sass 的继承功能
- cssnext 已被[postcss-preset-env](http://preset-env.cssdb.org/features)取代
- css Grace 面向未来

**css 里面可以直接写变量**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style type="text/css">
      :root {
        --ydcolor: red;
        --mainBg: #f5f5f5;
      }
      body {
        background: var(--mainBg);
      }
    </style>
  </head>
  <body></body>
</html>
<!-- 也可以直接用js操作css -->
<script>
  document.documentElement.style.setProperty('--mainBg', '#f00');
</script>
```

**gulp 配置 cssnext**

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');
var cssnext = require('cssnext');
gulp.task('css', function() {
  var processors = [
    autoprefixer({
      browsers: ['last 3 version'],
      cascade: false,
      remove: false,
    }),
    cssnext(),
    cssgrace,
  ];
  return gulp
    .src('./src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});
gulp.task('watch', function() {
  gulp.watch('./src/css/*.css', ['css']);
});
gulp.task('default', ['watch', 'css']);
```

## css 效果

可以看[css doodle](https://css-doodle.com/)这个网站
