---
title: CSS OO
date: 2022-01-17 15:47:10
---

## CSS OO 的概念

OO CSS 将页面可重用元素抽象成一个类，用 class 加以描述，而与其对应的 HTML 即可看成是此类的实例

### OO CSS 作用

- 加强代码复用以便于维护
- 减小 CSS 体积
- 提升渲染效率
- 组件库思想、栅格布局可共用、减少选择器，方便扩展

### 重置 css

- reset.css 重置浏览器
- normalize.css 修复浏览器
- neat.css 前两者融合

## BFC、IFC、GFC、FFC 是什么？

### BFC 是什么？

查看[什么是 BFC?](/myblog/css/bfc)

### IFC

> IFC(inline Formatting Contexts)直译为”内联格式化上下文“，IFC 的 line box（线框）高度由其包含行内元素中最高的实际高度计算而来(不受垂直方向的 padding/margin 影响)

### FFC

> FFC（flex Formatting Contexts）直译为”自适应格式化上下文“，display 值为 flex 或者 inline-flex 的元素将会生成自适应容器

### GFC

> GFC（Gridlayout Formatting Contexts）直译为 ”网络布局格式化上下文“,当为一个元素设置 display 为 grid 的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器(grid container)上定义网络定义行(grid definition rows)和网络定义列(grid definition columns)属性各在网络项目(grid item)上定义网络行(grid row)和网络列(grid columns)为每一个网络项目(grid item)定义位置和空间
