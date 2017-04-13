---
layout: post
title: "Selenium2讲解---至媳妇儿"
date: 2017-04-13 20:57:02
tags:
    - framework
permalink: /Selenium
---

* toc
{:toc}

关键词：**webdriver**、**wire协议**、**Http调用**。
## 什么是WebDriver
>当Selenium2.x 提出了WebDriver的概念之后，它提供了完全另外的一种方式与浏览器交互。**那就是把浏览器原生的API封装成一套Selenium WebDriver API**，直接操作浏览器页面里的元素，甚至操作浏览器本身（截屏，窗口大小，启动，关闭，安装插件，配置证书之类的）。由于使用的是浏览器原生的API，速度大大提高，而且调用的稳定性交给了浏览器厂商本身，显然是更加科学。然而带来的一些副作用就是，不同的浏览器厂商，对Web元素的操作和呈现多少会有一些差异，这就直接导致了 **Selenium WebDriver要分浏览器厂商不同而提供不同的实现**。例如Firefox就有专门的FirefoxDriver，Chrome就有专门的ChromeDriver等等。

总结：
1. **WebDriver就是把浏览器原生的API（接口）封装成了统一的Selenium WebDriver API**
2. **不同浏览器需要使用不同的driver(驱动程序)**

## 如何通过 WebDriver 让浏览器做事情
>在我们new一个webdriver过程中selenium会检测本地浏览器组件是否存在，版本是否匹配。接着会 **启动一个WebService**，这套Web Service使用了Selenium自己设计定义的协议，名字叫做 **The WebDriver Wire Protocol**。，这套协议几乎可以操作浏览器的任何操作，Wire协议是通用的，也就是说不管是FirefoxDriver还是ChromeDriver，启动之后都会在某一个端口启动基于这套协议的WebService。
例如FirefoxDriver初始化成功之后，默认会从`http://localhost:7055`开始，而ChromeDriver则大概是`http://localhost:46350`。
接下来，我们 **调用WebDriver的任何API，实际上是给Web Service发送HTTP请求**。在我们的HTTP 请求的body中，会 **以Wire协议规定的JSON格式的字符串** 来告诉Selenium我们希望浏览器接下来做什么事情。

总结：
1. **Webdriver启动一个webservice(web服务)**
2. **根据Wire协议给Webdriver发送HTTP请求**
    * request和response都以Wire协议规定的**JSON格式**的字符串通信
3. **webdriver接收到请求后再去操纵浏览器**

## 附：Wire 协议图一张
![](http://onk1k9bha.bkt.clouddn.com/2017-04-13-114724.jpg)
