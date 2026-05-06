---
title: css面试汇总
date: 2022-01-24 10:47:10
nav:
  title: 面试
  order: 1
group:
  title: 基础
  order: 2
---

## 1、css3 新特性：

- 1. CSS3 实现圆角（`border-radius`），阴影（`box-shadow`）， `border-image`
- 2. 对文字加特效（`text-shadow`），线性渐变（`gradient`），旋转（`transform`）
- 3. `transform:rotate(9deg) scale(0.85,0.90)` `translate(0px,-30px) skew(-9deg,0deg);`// 旋转,缩放,定位,倾斜
- 4. 增加了更多的 CSS 选择器 多背景 rgba
- 5. 在 CSS3 中唯一引入的伪元素是 `::selection.`
- 6. 媒体查询(media)，多栏布局

## 2、css 选择器的优先级

1. 不同级别

`!important(10000)>内联样式 style(1000) > #id(100) > class(10)/伪类(:hover) > tag(1)>通配符选择器`

2. 同一级别

- 后写的会覆盖先写的样式
- 内联(`行内,div内部`)样式>内部样式表(`头部 style`)>外部样式表(`link`)>导入样式(`@import`)

3. 复杂选择器优先级

- id 个数多的优先级高
- id 个数相等的看 class 个数，class 越多优先级越高
- id 和 class 个数相等，看元素个数，个数越多优先级越高。

```html
<!--虽然第三个样式的class个数多，但是他这个样式的span标签的样式是继承的，看第一个的总结，
他的优先级是最低的。所以他没有选中的优先级高。这里我就不写了，自己在第三个样式p的后面在写上一个span标签。
你会发现他的样式优先级是最高的。-->
<!-- 这里最后的结果颜色是red红色，因为直接选中的span比下面的class优先级高 -->
<style type="text/css">
  #box .head span {
    color: blue;
  }
  #box .head span {
    color: red;
  }
  #box .head .p {
    color: deeppink;
  }
</style>
<div class="box" id="box">
  <div class="head">
    <p class="p"><span>我的颜色</span></p>
  </div>
</div>
```

- 优先级相同，后面的样式会覆盖前面的样式， 不分先后顺序，只看选择器类型和个数

## 3、伪类和伪元素的区别

1. 伪类

就是用来选择 DOM 树之外的信息，不能够被普通选择器选择的文档之外的元素，用来提案及一些选择器的特殊效果，比如`:hover`、`:link`、`:visited`、`:first-child`、`:focus`、`:lang` 等

由于状态的变化是非静态的，所以元素达到一个特定的状态时,他可能得到一个伪类的样式，当状态改变的时候，他又会失去这个样式，所以他虽然和 class 有类似的效果，但是基于文档之外的抽象，所以叫做`伪类`

2. 伪元素

核心就是创建不存在于文档中的元素，比如`::before`、`::after`,伪元素控制的内容和元素是没有差别的，但是本身只是基于元素的抽象,`并不存在于文档中`，所以称为`伪元素`

**相同之处**

> 伪类和伪元素都不存在于源文件和 DOM 树中，也就是说在源文件和 DOM 树中是看不到伪类和伪元素的

**不同之处**

>

1. 表示方法不同，伪类用:,伪元素用::
   >
2. 定义不同，伪类是假的类;伪元素是假元素，需要通过添加元素才能达到效果

## 4、flex 布局的属性有哪些，都是干啥的？

1. 父元素属性

- `display:flex`，定义了一个 flex 容器

- `flex-direction` 决定主轴的方向
  - `row` 默认值 水平从左到右
  - `column` 垂直从上到下
  - `row-reverse` 水平从右到左
  - `column-reverse` 垂直从下到上
- `flex-wrap` 定义如何换行
  - `nowrap` 默认不换行
  - `wrap` 换行
  - `wrap-reverse` 换行且颠倒顺序，第一行在下面
- `flex-flow` 属性是 `flex-deriction` 属性和 `flex-wrap`属性的简写形式，默认值是 row nowrap
- `justify-content` 设置或检索弹性盒子元素在主轴(横轴)方向的对齐方式

  - `flex-start` 行起始位置对齐

  - `flex-end` 将向行结束位置对齐
  - `center` 弹性盒子元素将向行中对齐
  - `space-between` 弹性盒子平均的分布在行里
  - `space-around` 弹性盒子平均的分布在行里，两端保留子元素与子元素之间间距大小的一半

- `align-items` 弹性盒子在纵轴方向上的对齐

  - `flex-start`

  - `flex-end`
  - `center`
  - `baseline`
  - `stretch`

- `align-content` 弹性盒子堆叠伸缩行的对齐方式

  - `felx-start`

  - `flex-end`
  - `center`
  - `space-between`
  - `space-around`
  - `stretch`

2. 子元素上属性

- `order`
- `flex-grow` 用于设置或检索弹性盒子的扩展比率
- `flex-shrink` flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值
- `flex-basis` 用于设置或检索弹性盒伸缩基准值
- `flex` 是 `felx-grow`,`flex-sharink` 和 `flex-basis` 的间歇，默认值 0 1 auto,后两个属性可选
- `align-self` 设置子元素在纵轴上的对齐方式，可以覆盖 `align-items` 的设置

## 5、实现不知道宽高的 div 居中方式有几种？

1. `transform(-50%,-50%)`,往上（X 轴），左（Y 轴）移动自身长度的 50%，以使其居于中心位置

```css
.cell {
  background: #ff0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

2. 弹性布局 `flex`
   设置了 margin: auto 的元素，在通过 justify-content 和 align-self 进行对齐之前，任何正处于空闲的空间都会分配到该方向的自动 margin 中去

```html
<style type="text/css">
  .main {
    width: 200px;
    height: 200px;
    background: firebrick;
    display: flex;
  }
  .cell {
    margin: auto;
  }
</style>
<body>
  <div class="main">
    <div class="cell">
      <p>我爱你</p>
    </div>
  </div>
</body>
```

3. `display:table-cell,`
   组合使用 display:table-cell 和 vertical-align、text-align，使父元素内的所有行内元素水平垂直居中（内部 div 设置 display:inline-block 即可）

```css
.cell {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  max-width: 240px;
  /* width: 240px;
  height: 180px; */
  border: 1px solid red;
}
```

## 6、`display:none`和`visibility:hidden的区别？`

- `display:none`,是不占据空间，操作这个会导致**重绘和回流(重排)**
- `visibility:hidden`,占据空间只是隐藏起来了，操作这个会导致**重绘**

重排比重绘更消耗性能

## 7、盒模型概念，如何切换盒模型？

1. 标准盒模型
   元素的 width=content 的 width。

2. IE 盒模型(怪异盒模型)
   元素的 width=content 的 width+padding+border。

3. 切换两种盒模型方法

```css
box-sizing: content-box; //标准盒模型（默认）
box-sizing: border-box; //IE盒模型
```

## 8、实现 1px 边框？1px 线条？

- `transform: scale(0.5)`方案 - 推荐: 很灵活
  1. 设置`height: 1px`，根据媒体查询结合`transform`缩放为相应尺寸。
  ```css
  div {
    height: 1px;
    background: #000;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    overflow: hidden;
  }
  ```
  2. 用`::after`和:`:before`,设置`border-bottom：1px solid #000`,然后在缩放`-webkit-transform: scaleY(0.5);`可以实现两根边线的需求
  ```css
  div::after {
    content: '';
    width: 100%;
    border-bottom: 1px solid #000;
    transform: scaleY(0.5);
  }
  ```
  3. 用`::after`设置`border：1px solid #000; width:200%; height:200%`,然后再缩放`scaleY(0.5)`; 优点可以实现圆角，京东就是这么实现的，缺点是按钮添加 active 比较麻烦
  ```css
  .div::after {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #bfbfbf;
    border-radius: 4px;
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    -webkit-transform-origin: top left;
  }
  ```
