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

几个月前接了个新闻客户端的活儿，后端基本是（Spring Boot + Kotlin）技术栈，「后台管理」的前端用 react ，打包到 spring boot 的 jar 包里一起启动。服务器购买的华为云。

总的来说，还是很好玩的，碰到了很多以前只写业务逻辑时没有注意到的问题，好好的玩儿了一下爬虫、Kotlin，以及 docker 相关技术等等。

整个产品由以下几个模块组成：
1. 爬虫（爬人家的新闻）
2. 后台管理（多用户登陆、用户管理、广告管理、报表展示）
3. 新闻后端（给安卓客户端提供接口的）
4. 安卓客户端（请一个同学帮忙写的）

### 问题发现

周一发现，连续三天新闻量没有增加。（安利下 [网易有数](https://youdata.163.com/) #手动滑稽）
![](http://image.ysmull.cn/2019-07-23-075249.jpg)

登陆服务器后发现爬虫服务的日志如下：
![](http://image.ysmull.cn/2019-07-23-075250.jpg)

使用 `df -h` 命令查看，发现硬盘已经满了（云服务默认40G硬盘）。

### 问题解决

首先，想着去数据库上删除一些记录来节省空间。结果发现，MySQL 只能执行 SELECT 语句，无法执行 DELETE 语句，哪怕一条记录也删不掉。**（当磁盘满了之后，为什么delete语句也无法执行，有意思的问题）**

存储新闻的 news 表有十几G，小水管根本备份不下来。因此只能考虑给硬盘扩容。

华为云上可以在不重启的情况下，给已有的云硬盘扩容。我先花了十几块钱，买了 5 GB 的扩容包。用命令查询后发现，硬盘扩容没有生效。重启后服务器，发现硬盘扩容生效了，所有的服务都恢复正常了（看来还是得重启）。然后又买了一块的 100 GB 云硬盘，决定把所有的数据迁移到新硬盘上。
![](http://image.ysmull.cn/2019-07-23-080933.png)
购买后，使用 `fdisk -l` 看到已经有新硬盘挂载上来了：
![](http://image.ysmull.cn/2019-07-23-075251.jpg)

依次使用如下的命令给挂载硬盘到指定目录：

1. 使用 `fdisk /dev/vdb` 格式化新硬盘
2. 使用 `fmkfs.ext4 /dev/vdb` 创建分区
3. 使用 `mount /dev/vdb /data` 挂载硬盘到指定目录

然后删除 MySQL 容器， 把 MySQL 的数据文件移动到新目录。修改 docker-compose.yml 文件的 volumes 字段，让新启动的 MySQL 容器可以找到就的数据文件在哪。
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

在该目录下使用 `docker-compose up -d` 命令，即可重启 MySQL
至此，MySQL 数据迁移结束。
