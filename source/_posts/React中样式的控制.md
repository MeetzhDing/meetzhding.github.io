---
title: React中样式的控制
date: 2019-04-24 19:33:46
tags:
---

react 开发过程中，发现对于样式的使用有些不同，当需要实现元素样式动态变更时，就会使用 style 或 className 来进行。

<!--more-->

## react 向元素内，动态添加 style

例如：有一个 DIV 元素，需要动态添加一个 display:block | none 样式，那么：

```html
<div style={{display: (index===this.state.currentIndex) ? "block" : "none"}}>标签是否隐藏</div>
```

或者，多个样式写法：

```html
<div style={{display: (index===this.state.currentIndex) ? "block" : "none", color:"red"}}>标签是否隐藏</div>
```

## react 向元素内，动态添加 className
使用className时，往往会在jsx文件中import进入相应的css文件。

1、DIV 标签中，没有其他 class，只需要动态添加一个.active 的 className，来显示内容是否被选中状态，则：

```html
<div className={index===this.state.currentIndex?"active":null}>标签是否选中</div>
```

2、如果 DIV 标签本身有其他 class，又要动态添加一个.active 的 className，来显示内容是否被选中状态，则：

```html
<div className={["container tab", index===this.state.currentIndex?"active":null].join(' ')}>标签是否选中</div>
```

或者，使用 ES6 写法（推荐使用 ES6 写法）：

```html
<div className={`container tab ${index===this.state.currentIndex?"active":null}`}>标签是否选中</div>
```
