---
layout: post
title: "「细谈」Java 中的弱引用(WeakReference)"
date: 2019-08-03 11:13:00
tags: ["jvm"]
---

* toc
{:toc}

本文只讲弱引用，文章中的内容均来自本人的实践的总结，某些观点不常见于其它文章。
该文是理解 ThreadLocal 的基础。

## 弱引用(Weak Reference)
```java
WeakReference<T> weakRef = new WeakReference<>(referent);
```
当发生 gc 时， 如果 referent 对象满足下述条件则一定会被回收：
1. `referent` 没有强引用
2. `referent` 没有软引用

### 几种典型场景
* 最简单的例子
```java
WeakReference<List> arrRef = new WeakReference<>(Arrays.asList(1,2,3));
System.out.println(arrRef.get()); // [1, 2, 3]
System.gc();
System.out.println(arrRef.get()); // null
```
* 有强引用无法回收
```java
List<Integer> arr = Arrays.asList(1,2,3);
WeakReference<List> arrRef = new WeakReference<>(arr);
System.out.println(arrRef.get()); // [1, 2, 3]
System.gc();
System.out.println(arrRef.get()); // [1, 2, 3] 还有 arr 强引用，无法回收
arr = null;
System.gc();
System.out.println(arrRef.get()); // null
```
* final 的东西无法回收
```java
WeakReference<String> strRef1 = new WeakReference<>(new String("abc"));
System.gc();
System.out.println(strRef1.get()); // null
WeakReference<String> strRef2 = new WeakReference<>("abc");
System.gc();
System.out.println(strRef2.get()); // abc
```
* WeakReference 数组内的元素会被回收（弱引用数组的每个 item 都是弱引用）
```java
WeakReference<String> a = new WeakReference<>(new String("aaa"));
WeakReference<String> b = new WeakReference<>(new String("bbb"));
WeakReference[] tab = new WeakReference[] {a, b};
System.out.println(a.get()); // aaa
System.out.println(b.get()); // bbb
System.gc();
System.out.println(a.get()); // null
System.out.println(b.get()); // null
```

## ReferenceQueue
用来监视被引用的对象是否已经被回收了。下面我们用 referenceQueue 来探究一下 WeakReference 的回收。

***（为求代码清晰，下面的代码一律不捕获 `InterruptedException`）***

首先创建一个 referenceQueue， 在另一个线程中调用 remove，该调用是阻塞调用，如果有引用被回收，那么会调用成功，返回该该引用的 this。
最简单的例子：
```java
ReferenceQueue<String> referenceQueue = new ReferenceQueue<>();
// 监视线程
new Thread(() -> {
    Reference remove = referenceQueue.remove();
    System.out.println("remove:" + remove);
}).start();
WeakReference<String> ref = new WeakReference<>(new String("111"), referenceQueue);
System.gc(); // remove:java.lang.ref.WeakReference@322b4b46
```

### 特殊情况

1. 下例说明，**不把 new 出来的 WeakReference 赋值给任何变量，那么可能虚拟机可能当场就回收了**，因为 referenceQueue 并没有捕获到回收消息。
```java
1
ReferenceQueue<String> referenceQueue = new ReferenceQueue<>();
// 监视线程
new Thread(() -> {
       Reference remove = referenceQueue.remove();
       System.out.println("remove:" + remove);
}).start();
new WeakReference<>(new String("111"), referenceQueue);
System.gc(); // 什么都不打印
```
2. 下例说明，**显式调用 System.gc() 的线程，如果没有在该线程的任何地方使用到这个 ref，那么并不会触发 ref 的回收**。想要 ref 能够被回收，那么需要在 gc 线程的任意一个位置出现 ref。
```java
ReferenceQueue<String> referenceQueue = new ReferenceQueue<>();
// 监视线程
new Thread(() -> {
       Reference remove = referenceQueue.remove(); // 不会捕获到引用的回收
       System.out.println("remove:" + remove);
}).start();
WeakReference<String> ref = new WeakReference<>(new String("111"), referenceQueue);
// gc 线程
new Thread(() -> {
       // Object a = ref; // 取消注释，则可以捕获到回收
       Thread.sleep(1000);
       System.out.println("gc");
       System.gc(); // 在另一个线程 System.gc()
}).start();
```
