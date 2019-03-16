---
title: "Python发送邮件"
date: 2018-12-30 19:20:33
---

## 使用Python发送Email邮件

Python常被用于快速开发以及机器学习相关领域，当你需要运行一个时间不确定的任务时，你可以通过一个小程序，在任务结束后自动将程序执行报告发送到你的Email中。

使用Python自带的email库，就可以实现这个功能。

```python
# mail.py文件
import os
import json
import smtplib
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr
from email.utils import formataddr

# 本地保存的邮件设置信息
config_name = 'config.json'


def format_addr(s):
    name, addr = parseaddr(s)
    return formataddr((Header(name, "utf-8").encode(), addr))


def send_mail(content):
    if os.path.isfile(config_name):
        with open(config_name, 'r') as f:
            config = json.load(f)
    if not 'config' in locals().keys():
        print('Error!')
        print('Need config.json file!')
        exit()

    # 获得发件人，发件人密码，收件人，smtp服务器
    from_email = config['sender']
    from_email_pwd = config['passwd']
    to_email = config['receiver']
    smtp_server = config['smtp']

    # 从content中获得邮件内容
    msg = MIMEText(content['text'], content['text_type'], "utf-8")
    msg["From"] = format_addr("%s" % from_email)
    msg["To"] = format_addr("%s" % to_email)
    msg["Subject"] = Header(content['Subject'], "utf-8").encode()

    # 登录邮件服务器并发送内容
    server = smtplib.SMTP_SSL(smtp_server, timeout=200)
    server.set_debuglevel(1)
    server.login(from_email, from_email_pwd)
    server.sendmail(from_email, [to_email], msg.as_string())
    server.quit()
```

除了mail.py文件以外，还需要一个config_file，保存发送邮箱的账号与密码，账号需要开启smtp服务。

```
# config.py
{
    "sender": "***@126.com",
    "passwd": "***",
    "receiver": "***@qq.com",
    "smtp": "smtp.126.com"
}
```

文件mail.py的调用方法非常简单，直接使用send_mail函数，给出邮箱内容信息，就可以直接发送邮件了，邮件的内容格式如content所示。

```python
from mail import send_mail

def main():
    content = {
        'Subject': 'Server email test',
        'text': 'this is a plain text',
        'text_type': 'html'
    }
    send_mail(test_content)

if __name__ == '__main__':
    main()
```