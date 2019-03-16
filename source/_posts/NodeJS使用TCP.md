---
title: "NodeJS使用TCP"
date: 2018-12-30 19:58:01
---

## HTTP服务器

对于程序之间的数据交互，我们往往想到使用HTTP协议来进行，NodeJS中可以非常简单地实现一个HTTP服务器，作为一个比较典型的网络应用，可以说是麻雀虽小，五脏俱全。

下面是一个复读机程序，对于接收到的任何内容，回复相同的数据。

```js
var http = require('http');
var querystring = require('querystring');
var util = require('util')

http.createServer(function(req, res){
    var data = '';
    req.on('data', function(chunk){
        data += chunk;
    });
    req.on('end', function(){
        res.end('You said "' + data + '"');
    });
}).listen(8888)
```
<br>

## TCP服务器

在一些特殊的场合，比如嵌入式硬件中，可能希望使用资源消耗更小的TCP进行数据交互。这里的服务器实现了复读机功能。

最开始的时候，程序并没有进行超时处理，也没有对error情况进行处理，当一个TCP客户端没有正确地发送断开命令时，程序就可能进入error状态，进而导致整个程序完全崩溃。如果数据交互的过程中没有发生错误，对于同一个请求IP和端口的client，也可能会产生多个连接。

```js
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9999;

let server = net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    // 如果没有进行超时处理，对于频繁的TCP请求，将会耗费大量的资源
    sock.setTimeout(3000);

    sock.on('connect', function(){
        console.log('connect');
    })

    sock.on('ready', function(){
        console.log('ready');
    })

    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
    });

    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    // TCP连接发生错误或超时的情况下，断开这个连接
    sock.on('error', function(err) {
        console.log(err);
        sock.destroy();
    })

    sock.on('timeout', function() {
        console.log('timeout: '+ sock.remoteAddress + ' ' + sock.remotePort);
        sock.destroy();
    })
});

server.on('error', (err) => {
    console.log(err);
});

now = new Date(new Date().getTime() + 28800000);
console.log(now);
console.log('Server listening on ' + HOST +':'+ PORT);
server.listen(PORT, HOST);
```

## TCP客户端

市面上有许多的HTTP测试客户端，但是TCP的调试工具的功能往往比较局限，甚至可能有Bug存在。

这里使用NodeJS来实现了一个简单的TCP客户端，以便于在需要的时候对客户端进行功能的调整与扩充。

```js
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 9999;

var client = new net.Socket();
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    client.write('I am Chuck Norris!');
});

// data数据接受响应
client.on('data', function(data) {
    console.log('DATA: ' + data);
    client.destroy();
});

client.on('close', function() {
    console.log('Connection closed');
});
```
