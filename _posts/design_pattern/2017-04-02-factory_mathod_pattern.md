---
layout: post
title: Factory Method
date: 2017-04-02 23:16:28
tags:
    - design_pattern
---

### 定义
>**定义一个创建对象的接口,让其子类自己决定实例化哪一个工厂类,工厂模式使其创建过程延迟到子类进行.**

### 实践
工厂方法模式需要使用继承。在《大话数据结构》里使用的是继承一个只含有工厂方法的接口。《Head First 设计模式》里是继承一个抽象类，这个类不仅包括未实现的抽象工厂方法，而且实现了操纵产品的方法。这个抽象类就是产品的使用者。我们使用后者来讲述这个设计模式。

首先，Product同[simple factory pattern](/blog/simple_factory_pattern)。
然后定义一个抽象的基类，其中`protected abstract Product getProduct(String type)`就是**工厂方法**，它将在子类被实现。
```java
public abstract class AbstractCreator {
    public void operation() {
        //这里可以算是 client 的代码了
        Product product = getProduct();
        product.process();
    }
    // factory method
    protected abstract Product getProduct();
}
```
有几种产品就创建几个ConcreteCreator类
```java
public class ConcreteCreator1 extends AbstractCreator {
    @Override
    protected Product getProduct() {
        return new ConcreteProduct1();
    }
}
public class ConcreteCreator2 extends AbstractCreator {
    @Override
    protected Product getProduct() {
        return new ConcreteProduct2();
    }
}
...
```
使用方法:
```java
AbstractCreator creator1 = new ConcreteCreator1();
creator1.operation();
AbstractCreator creator2 = new ConcreteCreator2();
creator2.operation();
```
当需要增加一种产品的时候，新建一个类继承AbstractCreator，实现工厂方法getProduct即可。工厂方法模式客服了简单工厂模式违背「开放-封闭」原则的缺点。
我们来看一下，当增加一个产品的时候，我们需要做哪些事情：
1. 添加一个产品类------>这个是无法避免的，我们对扩展开放。
2. 如果工厂方法是在某个抽象类中，新建一个类继承该抽象类，覆盖工厂方法，返回新产品。
3. 如果工厂方法在接口IFactory中，那么就要新建一个工厂实现IFactory来返回该产品。
4. 在client使用时，得new一个新的类来产生新产品。

-----

工厂方法也可以参数化，变得像一个简单工厂
```java
public abstract class AbstractCreator {
    public void operation(String type) {
        Product product = getProduct(type);
        product.process();
    }
    // factory method
    protected abstract Product getProduct(String type);
}

public class ConcreteCreator extends AbstractCreator {
    @Override
    protected Product getProduct(String type) {
        if (type.equals("1")) {
            return new ConcreteProduct1();
        } else if (type.equals("2")) {
            return new ConcreteProduct2();
        } else {
            return null;
        }
    }
}
```
使用方法:
```java
AbstractCreator creator = new ConcreteCreator();
creator.operation("1");
creator.operation("2");
```
