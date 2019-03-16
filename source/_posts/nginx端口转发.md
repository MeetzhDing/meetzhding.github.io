---
title: "Nginx端口转发"
date: 2019-01-27 17:24:04
---

在小程序的开发过程中，一个必须解决的问题，就是小程序只能发出https与wss请求，这里采用nginx配置中的反向代理来完成。只需要服务器的nginx中加载了证书，就可以使用端口代理的方式，实现多个应用同时使用代理证书，保障了数据的安全性。

```conf
location /wehome/ {
    proxy_pass http://127.0.0.1:5757/wehome/;
    proxy_http_version	1.1;
    proxy_cache_bypass	$http_upgrade;
    proxy_set_header Upgrade		$http_upgrade;
    proxy_set_header Connection		"upgrade";
    proxy_set_header Host		$host;
    proxy_set_header X-Real-IP		$remote_addr;
    proxy_set_header X-Forwarded-For	$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto	$scheme;
    proxy_set_header X-Forwarded-Host	$host;
    proxy_set_header X-Forwarded-Port	$server_port;
}
```