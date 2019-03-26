---
title: "安装node-sass的方法"
date: 2019-03-13 15:46:03
---

在平时的日常生活中，总会遇到一些奇怪的小问题，在这里进行一个简单的记录。

<!-- more -->

当我尝试安装node-sass时，反复遇到node-gyp的安装依赖问题，最终找到了如下的解决办法
```
npm install node-sass --sass-binary-site=http://npm.taobao.org/mirrors/node-sass
```