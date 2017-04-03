---
layout: post
title: (1) Simple Factory Pattern
date: 2017-04-02 21:22:11
tags:
    - design_pattern
---

首先说一个被叫做**简单工厂模式**的编程技巧，有说这个其实不算一个设计模式的。

准备好**产品**
```java
public interface Product {

    void process();

}
```
```java
public class ConcreteProduct1 implements Product {
    @Override
    public void process() {
        System.out.println("product1 is processing...");
    }
}
...
```
![](http://onk1k9bha.bkt.clouddn.com/2017-04-02-133144.jpg)
然后准备**工厂**，`SimpleProductFactory`就是个**简单工厂**，为了描述方便对模式的描述，type为String类型。
```java
public class SimpleProductFactory {
    public Product getProduct(String type) {
        if (type.equals("1")) {
            return new ConcreteProduct1();
        } else if (type.equals("2")) {
            return new ConcreteProduct2();
        } else if (type.equals("3")) {
            return new ConcreteProduct3();
        } else if (type.equals("4")) {
            return new ConcreteProduct4();
        } else {
            return null;
        }
    }
}
```
client使用工厂
```java
SimpleProductFactory factory = new SimpleProductFactory();
factory.getProduct("1").process();
factory.getProduct("2").process();
factory.getProduct("3").process();
factory.getProduct("4").process();
```
当需要增加一个ConcreteProduct5时，首先要新添加这个产品类，然后在工厂的实现里增加一个分支，为了避免增加分支，可以使用反射。
```java
public Product getProduct(String className) {
    try {
        Class clazz = Class.forName(classPrefix + className);
        return (Product)clazz.newInstance();
    } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
        e.printStackTrace();
        return null;
    }
}
```
client使用工厂
```java
SimpleProductFactory factory = new SimpleProductFactory();
factory.getProduct("ConcreteProduct5").process();
```
