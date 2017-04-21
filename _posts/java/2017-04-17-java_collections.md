---
layout: post
title: "Java Collections Framework 学习"
date: 2017-04-15 23:29:57
tags: ["java", "collection"]
---

## Introducton
Java 平台包含了集合框架。集合是一组对象的代表(比如经典的 Vector class)。集合的 *表示* 和 *操作* 被集合框架统一管理，使得集合能被独立操作而不用关心其实现细节。

主要的优点有:
* **Reduces programming effort**: 提供了数据结构和算法，你不用自己去实现这些。
* **Increases performance**: 提供了对数据结构和算法的高性能实现。并且许多实现拥有统一的接口，程序可以很方便的通过切换实现进行调整。
* **Provides interoperability(互操作性) between unrelated APIs**: 建立了处理集合的统一接口。
* **Reduces the effort required to learn APIs**: 提供了特别设计的集合APIs。
* **Fosters software reuse**: 为集合和算法提供了操纵和使用它们的标准接口。

Java集合框架包括:
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
* **Array Utilities**: 为数组提供了使用的函数。确切的说不是集合框架的一部分，但是是和集合框架同事加进Java平台的。[[1]] [1]




## 参考资料
[1]:http://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html "Collections Framework Overview - Oracle"
[2]:http://docs.oracle.com/javase/8/docs/technotes/guides/collections/reference.html "Outline of the Collections Framework"
