---
title: 浏览器输入URl到页面显示
date: 2019-04-11 23:15:12
tags:
---

到处都会有这样的问题，在浏览器中输入URL到页面显示会发生什么，其实这个过程中总体可以分为以下两个部分：
- 一次HTTP完整事务
- 浏览器的页面渲染机制。

<!-- more -->

---

## 一次HTTP完整事务过程

### 输入URL，从URL中解析出服务器的域名
- 浏览器缓存中查找 系统缓存查找
- 本地DNS服务器缓存
- 递归查询与迭代查询

### 构建HTTP请求包(HTTP头，HTTP体)
- 传输层发送TCP连接，3次握手
- TCP重要过程：窗口滑动 流量控制 拥塞处理
- TCP包在网络层被封装成IP包
- IP包在数据链路层被封装成数据帧
- 数据帧在物理层被转为比特流

### HTTPS服务原理
SSL层是夹在传输层和应用层之间的，为应用层的各种协议提供安全服务。
相关的基本原理可以参见[https原理及流程](https://www.jianshu.com/p/14cd2c9d2cd2)

### 服务端程序处理

处理结束后，将找到的资源封装成HTTP响应包，发送给客户端, 发送成功后，关闭连接。

---

## 客户端页面渲染
- HTML解析器解析HTML，转换为DOM Tree
- CSS解析器解析CSS，提取CSS Rules
- 将HTML和CSS混合为一个attachment
- attachment通过布局(layout)被转换为一个Render Tree
- Render Tree通过绘制就显示页面了

你可以直接查看[你不知道的浏览器页面渲染机制](https://www.jianshu.com/p/a6553a98bda3)，讲述了一些简单的页面渲染机制以及部分前端优化操作的理由。

更多深入内容参见 [浏览器的工作原理](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)，一篇全面介绍 WebKit 和 Gecko 内部操作的入门文章，是以色列开发人员塔利·加希尔大量研究的成果。