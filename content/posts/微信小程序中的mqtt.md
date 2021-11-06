---
title: "微信小程序中的mqtt"
date: 2019-03-06 23:11:14
---

今天折腾了一天，因为需要在微信小程序中使用mqtt客户端，连接到阿里云iot平台。

<!-- more -->

众所周知，微信小程序网络的主要使用https和wss两种方式，所以小程序和iot平台的连接使用mqtt over websocket方式来维持长连接。

今天试验了多个npmjs中的多个mqtt包，结果发现大部分都与小程序的环境不兼容，或者直接是包的依赖太多，尝试在小程序中进行构建‘构建npm’时，发生了报错。

今天尝试的包有以下几个

1. paho.mqtt.js
2. web-mqtt-client
3. paho.mqtt.wxapp
4. mqtt

首先是paho.mqtt.js，这是一个标准的既可以在浏览器和nodejs环境中调用的ecilpse官方包，我成功地在非微信小程序中实现了连接，但是在小程序的调试环境中总是失败，最后放弃，这个是有并没有意识到它就是没办法在小程序中使用，还以为是自己使用不正确。

接着我转向使用web-mqtt-client，它的内核依旧是paho.mqtt.js，但是在表面添加了自己的外壳，api总体显得更加友好，但是依然是失败的。

因为我知道有不少小程序使用了mqtt连接，所以一定是会有办法去进行连接的，网上的许多博客都指向一个个人开发的包paho.mqtt.wxapp。

paho.mqtt.wxapp这个包为依照paho官方api，进行修改得到的一个用户微信小程序环境的包，但是他已经停止维护一年了，在测试的过程中，我发现它无法在node环境中使用。而在微信小程序运行的时候， 发生了一个我意想不到的情况，在连接的解析过程中，似乎对于符号 - 并不能正确处理，导致程序直接无法继续运行，我查看源码后发现，使用了正则表达式进行网址匹配处理，但是似乎匹配的并不够全面，最终放弃了更改的想法。

最终我来到了mqtt。mqtt包的文档中就有说它实现了微信小程序的兼容，但是依然有许多关于微信小程序的issue，文档也没有给出使用的办法。采用传统npm方法安装以后，发现小程序没办法导入，小程序构建npm也无法成功。
这个时候似乎陷入了僵局，我尝试使用webpack工具将其抽离复杂的依赖环境，失败了。
最后我发现官方提供了一个独立文件的版本，入口并不明显，我在下载了这个独立文件后，终于能够成功导入了！


```js
var mqtt = require('./lib/mqtt');
var client = mqtt.connect('wxs://a16dZw8w8UH.iot-as-mqtt.cn-shanghai.aliyuncs.com', {
    clientId: 'esp8266|securemode=2,signmethod=hmacsha1|',
    username: 'esp8266&a16dZw8w8UH',
    password: '4707EEDA97CDBBEEDC60016E056F9ED2D9403D94'
})

client.on('connect', function () {
console.log(`connected`);
client.subscribe('/a16dZw8w8UH/esp8266/get', function (err) {
        if (!err) {
            client.publish('/a16dZw8w8UH/esp8266/update', '{"TargetName":"phone"}')
        }
    })
})
client.on('message', function (topic, message) {
// message is Buffer
console.log(message.toString())
    client.end()
})
```

这里简单记录一下代码，其中需要注意的有两点。
1. require('./lib/mqtt') 导入方式使用的是单文件的导入。
2. mqtt.connect('wxs://...', opts) 连接时网址使用的协议需要以wxs开头，而不是wss。

