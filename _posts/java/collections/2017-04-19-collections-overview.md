---
layout: post
title: "JCF -- Overview"
permalink: /JCF/Overview.html
date: 2017-04-19 14:30:10
tags: ["framework"]
---

* toc
{:toc}

## Collection Consists
* **Collection interfaces**: 描绘了不同的集合类型，比如`sets`、`lists`、`maps`。这些接口建立了集合框架的基础。
* **General-purpose implementations**: 对集合接口的通用实现。
* **Legacy implementations**: 很早版本的集合类 Vector 和 Hashtable 也实现了新的接口。
* **Special-purpose implementations**: 一些专用的实现。这些实现拥有非标准化的性能特性、使用限制和行为。
* **Concurrent implementations**: 为高并发场景而设计的实现。
* **Wrapper implementations**: 为其它实现增加了功能，比如同步。
* **Convenience implementations**: 一组简化版高性能实现。
* **Abstract implementations**: 一些加速某些实现构建的实现。
* **Algorithms**: 在集合上运行的一些有用的静态方法，比如给列表排序。
* **Infrastructure**: 对集合提供重要支持的接口
* **Array Utilities**: 为数组提供了使用的函数。确切的说不是集合框架的一部分，但是是和集合框架同事加进Java平台的。

## Collection Interfaces

java.util.Collection 的后代:

![](http://onk1k9bha.bkt.clouddn.com/2017-04-19-collection_interfaces.png?imageView2/1/q/100)

java.util.Map 的后代:

![graph](http://onk1k9bha.bkt.clouddn.com/2017-04-19-map_interfaces.png?imageView2/1/q/100)

## Collection Implementations

| Interface |  Hash Table  | Resizable Array | Balanced Tree |   Linked List   | Hash Table + Linked List |
|:----------|:------------:|:---------------:|:-------------:|:---------------:|:------------------------:|
| Set       | [HashSet][1] |                 | [TreeSet][2]  |                 |    [LinkedHashSet][3]    |
| List      |              | [ArrayList][4]  |               | [LinkedList][5] |                          |
| Deque     |              | [ArrayDeque][6] |               | [LinkedList][7] |                          |
| Map       | [HashMap][8] |                 | [TreeMap][9]  |                 |   [LinkedHashMap][10]    |


## Concurrent Collections

### Interface

* BlockingQueue
* TransferQueue
* BlockingDeque
* ConcurrentMap
* ConcurrentNavigableMap

### Implementations
* LinkedBlockingQueue
* ArrayBlockingQueue
* PriorityBlockingQueue
* DelayQueue
* SynchronousQueue
* LinkedBlockingDeque
* LinkedTransferQueue
* CopyOnWriteArrayList
* CopyOnWriteArraySet
* ConcurrentSkipListSet
* ConcurrentHashMap
* ConcurrentSkipListMap

[1]: /JCF/HashSet.html
[2]: /JCF/TreeSet.html
[3]: /JCF/LinkedHashSet.html
[4]: /JCF/ArrayList.html
[5]: /JCF/LinkedList.html
[6]: /JCF/ArrayDeque.html
[7]: /JCF/LinkedList.html
[8]: /JCF/HashMap.html
[9]: /JCF/TreeMap.html
[10]: /JCF/LinkedHashMap.html
