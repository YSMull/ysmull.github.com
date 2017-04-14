---
layout: post
title: "在阿里云上搭建Jekyll静态博客"
date: 2017-04-14 22:44:15
tags:
    - article
---

* toc
{:toc}

```
useradd ysmull
vi /etc/sudoers
ysmull        ALL=(ALL)      ALL
sudo apt-get install ruby ruby-dev
sudo gem install jekyll
ssh-keygen -t rsa -b 4096 -C "aliyun"
sudo apt-get install git
git clone git@github.com:YSMull/ysmull.github.com.git
nohup jekyll server &
sudo apt-get install nginx


```

```
/etc/nginx/nginx.conf

server {
  listen 80;
  server_name www.ysmull.cn ysmull.cn;
  location / {
    proxy_pass http://0.0.0.0:4000;
  }
}
```
