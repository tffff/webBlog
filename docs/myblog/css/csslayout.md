---
title: CSS布局方式汇总
date: 2022-01-17 19:47:10
---

## pc 端布局

### 圣杯布局

为了让中间 div 内容不被遮挡，将中间 div 设置了左右 padding-left 和 padding-right 后，将左右两个 div 用相对布局 position: relative 并分别配合 right 和 left 属性，以便左右两栏 div 移动后不遮挡中间 div

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圣杯布局</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }

      .container {
        min-width: 400px;
        height: 200px;
        /*预留出位置  */
        padding-left: 200px;
        padding-right: 150px;
      }

      .main {
        width: 100%;
        height: 100px;
        float: left;
        background-color: red;
      }

      .left {
        width: 200px;
        height: 200px;
        background-color: skyblue;
        float: left;
        margin-left: -100%;
        position: relative;
        left: -200px;
      }

      .right {
        width: 150px;
        height: 150px;
        background-color: skyblue;
        float: left;
        margin-left: -150px;
        position: relative;
        right: -150px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="main">中间</div>
      <div class="left">左边</div>
      <div class="right">右边</div>
    </div>
  </body>
</html>
```

### 双飞翼布局

为了让中间 div 内容不被遮挡，直接在中间 div 内部创建子 div 用于放置内容，在该 div 里用 margin-left 和 margin-right 为左右两栏 div 留出位置

- float 实现
- position 实现
- 负边距
- 等高
- 盒子模型
- 清除浮动

```html
<!-- 正常情况下是左中右布局，但是要考虑一个问题，就是html解析是从上到下解析，这样会导致left优先解析，但是这样不对的,因为一个网页中用户最关心的是中间区域的位置，所以我们必须先解析中间模块，所以左中右布局是不行的，我们要想办法让middle优先解析 -->

<!-- 双飞翼布局 -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>双飞翼布局</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }

      .container {
        min-width: 400px;
        height: 300px;
        background: honeydew;
      }
      .left {
        width: 200px;
        height: 200px;
        background: red;
        float: left;
        margin-left: -100%; /*让左边的盒子移动到最左边*/
      }
      .right {
        width: 200px;
        height: 200px;
        background: red;
        float: left;
        margin-left: -200px; /*让右边的盒子移动到最右边*/
      }
      .main {
        width: 100%;
        height: 200px;
        background: lawngreen;
        float: left;
      }
      .content {
        margin-left: 200px; /*让中间的盒子空出左右两边的宽度*/
        margin-right: 200px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="main">
        <div class="content">中间</div>
      </div>
      <div class="left">左边</div>
      <div class="right">右边</div>
    </div>
  </body>
</html>
```

### flex 布局

## 移动端

- 使用 vh,vm,rem，目前设计稿都是 640、750、1125 的设计

```js
10 / 16 = 0.625; //一般是按照这个大小来设置
```

- 移动端字体不建议用 rem，data-dpr 动态设置字体大小，屏幕变大放更多的字，或者屏幕变大放更多的字
- 神奇的 padding/margin-top 等比例缩放间距
- html{box-sizing:border-box;},文字超出也不担心被撑开，他会向内挤
- 写字体不要只写中文名字，要保证西文字体在中文字体前面，mac>windows>linux
- 不要直接使用设计师的 font-family
- font-family:sans-serif:系统默认，字体多个单词
