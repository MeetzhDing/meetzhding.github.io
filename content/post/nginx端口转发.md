---
title: "Nginx端口转发"
date: 2019-01-27T17:24:04+08:00
draft: true
---

```conf
location /wehome/ {
  proxy_pass http://127.0.0.1:5757/wehome/;
  proxy_http_version	1.1;
	proxy_cache_bypass	$http_upgrade;
	proxy_set_header Upgrade			$http_upgrade;
	proxy_set_header Connection 		"upgrade";
	proxy_set_header Host				$host;
	proxy_set_header X-Real-IP			$remote_addr;
	proxy_set_header X-Forwarded-For	$proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto	$scheme;
	proxy_set_header X-Forwarded-Host	$host;
	proxy_set_header X-Forwarded-Port	$server_port;
}
```