---
title: async函数实现原理
date: 2019-04-14 15:00:45
tags:
---


最近读了不少有关js语言新特性的文章，其中有一个部分比较有意思，探讨async与await的实现原理，看了以后很受启发，觉得设计的比较精巧。

<!--more-->

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
```
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

所有的async函数都可以写成上面的第二种形式，其中的spawn函数就是自动执行器。

下面给出spawn函数的实现，基本就是前文自动执行器的翻版。
```
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

原文参见 [async 函数的实现原理](http://es6.ruanyifeng.com/#docs/async#async-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)

以上内容其实已经足够简洁明了，如果你还没有看懂，可以看一下[这篇文章](https://www.jianshu.com/p/862ab6d1a2f6), 他将async await操作直接总结为generator + yield + promise，使用了bebal转译后的代码进行说明，讲的也比较清楚。