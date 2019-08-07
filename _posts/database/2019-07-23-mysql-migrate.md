---
layout: post
title: 记录一次数据库迁移
category: ''
description: 
tags:
    - database
    - action
---

* toc
{:toc}

### 前情提要

几个月前帮同学做了个新闻app，后端基本是（Spring Boot + Kotlin）技术栈，「后台管理」的前端用 react ，打包到 spring boot 的 jar 包里一起启动。服务器购买的华为云。

整个产品由以下几个模块组成：
1. 爬虫（爬新闻，插入 MySQL 数据库）
2. 后台管理（多用户登陆、用户管理、广告管理、报表展示）
3. 新闻后端（给安卓客户端提供后端服务）
4. 安卓客户端（请另一个同学写的）

同时我使用了~~给我发工资的~~优秀的[网易有数](https://youdata.163.com/)来监控爬虫情况，每天发送爬虫日报。

### 问题发现

周一发现，连续三天新闻量没有增加。
![](http://image.ysmull.cn/2019-07-23-075249.jpg)

登陆服务器后发现爬虫服务的日志如下：
![](http://image.ysmull.cn/2019-07-23-075250.jpg)

使用 `df -h` 命令查看，发现硬盘已经满了（云服务默认40G硬盘）。

### 问题解决

首先，想着去数据库上删除一些记录来节省空间。结果发现，MySQL 只能执行 SELECT 语句，无法执行 DELETE 语句，哪怕一条记录也删不掉。**（当磁盘满了之后，为什么delete语句也无法执行，有意思的问题）**

存储新闻的 news 表有十几G，小水管根本备份不下来。删也删不掉，下载也下载不下来，数据又不能全部丢掉，因此只能考虑给硬盘扩容了。

华为云上可以在不重启的情况下，给已有的云硬盘扩容。我先花了十几块钱，买了一个 5 GB 的扩容包，发现果然所有服务都恢复正常了（可以正常插入数据）。

然后本着折腾的心态，申请了经费，又买了一块单独的 100 GB 云硬盘，决定用这个空白的 100 G 硬盘专门存放 MySQL 数据，防止数据过几天又满了的问题，同事等数据再多些，准备上 ELK 技术栈玩玩。

![](http://image.ysmull.cn/2019-07-23-080933.png)
购买后，使用 `fdisk -l` 看到已经有新硬盘挂载上来了：
![](http://image.ysmull.cn/2019-07-23-075251.jpg)

依次使用如下的命令初始化硬盘，并挂载硬盘到指定目录：

1. 使用 `fdisk /dev/vdb` 格式化新硬盘
2. 使用 `fmkfs.ext4 /dev/vdb` 创建分区
3. 使用 `mount /dev/vdb /root/dbDisk` 挂载硬盘到指定目录（/root/dbDisk）

接下来，我们删除 MySQL 容器，把所有 MySQL 的数据文件移动到新目录。修改 docker-compose.yml 文件的 volumes 字段，使用 `docker-compose up -d` 命令启动 MySQL。
```yaml
version: "3"
services:
  db:
    image: "mysql:8.0.16"
    restart: always
    command: --max_allowed_packet=20971520 --default-authentication-plugin=mysql_native_password
    environment:
        MYSQL_ROOT_PASSWORD: ''****************''
        MYSQL_USER: ''****************''
        MYSQL_PASSWORD: '****************'
        MYSQL_DATABASE: 'news'
        MYSQL_ROOT_HOST: '%'
        TZ: 'Asia/Shanghai'
    volumes:
       - /root/dbDisk/dbData:/var/lib/mysql
    ports:
      - '4396:3306'
```

至此，MySQL 数据迁移结束。
