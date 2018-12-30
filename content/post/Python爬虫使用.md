---
title: "Python爬虫使用"
date: 2018-12-30T12:28:30+08:00
draft: false
---

写过一些零散的代码，但是因为代码量小，重写快，往往都会直接把代码的文件删去，当下次又有重复的需求的时候，可能就需要再次重写。
现在想想，可以把这些代码放在博客上面，作为一个简单的参照。

这是一篇有关于爬虫的个人记录，其中对于曾经用过的BeautifulSoup, selenium, request, asyncio库进行一个记录。

<br>

## 爬取网站中的新闻稿
学校的网站没有做反爬处理，新闻稿的格式也十分规整，所以可以直接使用request来进行请求，得到网页的返回内容。

```python
import requests
import os.path
import json
from bs4 import BeautifulSoup

# absdir = os.path.dirname(os.path.abspath(__file__))

# 网页抓取内容的存放文件夹
target_dir = 'D:/src_dir/' 


def main(url, base_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36'
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print('Error:', resp.status_code)
        return
    
    html_doc = resp.content
    soup = BeautifulSoup(html_doc, 'html.parser')
    content = soup.find_all('div', class_='infobox')[0]

    # 对于网页中的src=/开头的img资源，将网页的网址前添加上base_url
    for i in content.find_all('img'): 
        if i['src'][0] == '/':
            i['src'] = base_url + i.get('src')

    # 获得新闻稿的标题
    title = content.find_all('h1', class_='arti_title')[0].get_text()
    # 获得新闻稿的日期
    arti_update = content.find_all('span', class_='arti_update')[0].get_text()
    data = arti_update.split('：')[1]

    # 文件以标题和日期进行命名
    filename = data + title + '.html'

    with open(filename, 'w' , encoding='utf8') as f:
        f.write(str(content))


if __name__ == '__main__':
    # 网页中的src链接以base_url作为基准获得各类资源
    base_url = 'http://ci.hfut.edu.cn'  
    url = 'http://ci.hfut.edu.cn/2018/1203/c3962a194604/page.htm'
    main(url, base_url)
```

整个网页抓取的过程非常简单，其中唯一特殊的操作，就是将img的src路径进行更改，将原本为 src=/\* 替换为 src=/base_url/\* 

---
<br><br><br>

## 通用的文档格式转换工具[Pandoc](https://github.com/jgm/pandoc)

通过Pandoc，我们可以将得到的html文件直接转换成为word文档。最为重要的是，对于html内的链接，Pandoc会进行下载，直接放置到word文档的对应位置。

之前在爬取网页时，将html内相对路径的src转换为绝对路径，也就是为了便于Pandoc进行自动化图片抓取。

首先介绍一下Pandoc的基本使用方法
    
    pandoc --reference-doc D:/template.docx {src_file} -o {output_file}'

这里的--reference-doc 是一个可选的参数，对于想要生成的文档，指定不同的样式。
一个简单的技巧是，先使用无--reference-doc 参数的命令生成一份word文档，接着打开文档，对标题居中加粗等样式处理，再以此调整过的样式文档作为模板，批量产生文档文件。

当我们只有寥寥数个文档需要进行转换时，我们可能就直接从命令行中进行了，但是当我们需要转换大量的文档时，就需要使用批量方法来进行了。

我们本可以直接使用一个for循环，进行Pandoc命令的系统调用，每当操作结束后开始下一条Pandoc命令，但是由于转换过程需要下载html中的图片内容，所以可能会遇到io阻塞的情况。这里我们使用asyncio库进行协程处理，这样就可以避免建立无意义的线程，也避免了来自网络的阻塞情况。

```python
import os
import asyncio

src_dir = 'D:/src_dir/'
target_dir = 'D:/out_dir/'

# 系统调用执行cmd命令，进行文档转换
async def cmd_call(cmd):
    await os.system(cmd)
    print(cmd)

async def main():
    tasks = []
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            # 设置输出文件名称
            filename = file.split('.')[0]
            out_file = filename + '.docx'
            # cmd为系统之执行的命令
            cmd = f'pandoc --reference-doc D:/template.docx {src_file} -o {out_file}'

            # 添加异步任务的编号到tasks数组中
            tasks.append(asyncio.ensure_future(cmd_call(cmd)))
    await asyncio.wait(tasks)

if __name__ == '__main__':
    # 获取事件循环，并运行直到所有任务都完成为止
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
```
        
---
<br><br><br>

## 使用selenium爬取动态网页

之前使用request方法来获取网页内容，这样仅仅适合用于静态的网页内容，对于动态的php页面，就无能为力了。
这种时候，我们就可以去使用selenium去调用浏览器来进行操作。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from bs4 import BeautifulSoup
import re
import requests

article_no = [2623,2592,2591]

base_url = 'http://zl.univs.cn'
url = 'http://zl.univs.cn/show.php?classid='
prag = ''
browser = webdriver.Chrome()

try:
    for no in article_no:
        browser.get(url + str(no))
        html_doc = browser.page_source
        # print(html_doc)
        soup = BeautifulSoup(html_doc, 'html.parser')
        article = (soup.find_all('div', class_='article-box'))[0]
        title = (article.contents[1].find_all('h3'))[0].string
        article_con = article.contents[3]
        for i in article_con.contents[1::2]:
            if i==None or not hasattr(i, 'find_all'):
                continue
            img_list = i.find_all('img')
            if len(img_list) != 0:
                for img_info in img_list:
                    try:
                        src = img_info.get('src')
                        img_filename = src.split('/')[-1]
                        img = requests.get( base_url + src)
                        img_file = open(img_filename,'wb')
                        img_file.write(img.content)
                    except:
                        if 'img_file' in dir():
                            img_file.close()
                        print('Error ',no)
            else:
                text = i.get_text()
                re.sub('\s',' ',text)
finally:
    browser.close()
```

---
<br><br><br>

## 从ishadows爬取json

个人使用shadowsocksR来进行网络代理，但是网络常常出现问题，写了一个小工具从网页中提取config信息

代码非常简单，直接使用bs4来获取网页中的配置信息

```python
import requests
import os.path
import random
import json
from bs4 import BeautifulSoup

# absdir = os.path.dirname(os.path.abspath(__file__))
target_dir = 'D:/tools/ShadowsocksR/'
filename = 'gui-config.json'
url = 'https://a.ishadowx.net/'

gui_config = {}
base_config = {
    "remarks" : "",
    "id" : "",  # 尚未找到id的生成规则，先使用随机数代替
    "server" : "",
    "server_port" : 0,
    "server_udp_port" : 0,
    "password" : "",
    "method" : "aes-256-cfb",
    "protocol" : "origin",
    "protocolparam" : "",
    "obfs" : "plain",
    "obfsparam" : "",
    "remarks_base64" : "",
    "group" : "",
    "enable" : True,
    "udp_over_tcp" : False
}


def main():
    gui_config = json.load(open(os.path.join(target_dir, filename)))
    if len(gui_config['configs']) > 0:
        gui_config['configs'] = gui_config['configs'][:1]  # 保留第一项配置

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36'
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print('Error:', resp.status_code)
        return
    html_doc = resp.content
    soup = BeautifulSoup(html_doc, 'html.parser')
    hover_list = soup.find_all('div', class_='hover-text')
    # print(hover_list)
    lam = lambda x: str(x) if x<10 else chr(x+55)
    for hover in hover_list[6:9]:
        span_list = hover.find_all('span')
        base_config['server'] = span_list[0].string
        base_config['server_port'] = span_list[2].string[:-1]  # 去掉尾部的'\n'
        base_config['password'] = span_list[4].string[:-1]
        hex32len = ''.join(list(map(lam, [random.randint(0,15) for i in range(0,31)])))
        base_config['id'] = hex32len
        # print(hex32len)
        gui_config['configs'].append(base_config.copy())
    # print(gui_config['configs'])
    json.dump(gui_config, open(os.path.join(target_dir, filename), 'w'), indent=4)


if __name__ == '__main__':
    main()

```
<br><br><br>