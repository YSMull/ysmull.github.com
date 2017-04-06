---
layout: post
title: Abstract Factory
date: 2017-04-03 11:37:26
tags:
    - design_pattern
---

### 定义
>**“提供一个接口，用来创建相关或依赖对象的家族，而无需指定它们具体的类。”**

### 实践
抽象工厂模式其实就是对工厂方法模式的升级版。工厂方法模式的那个工厂接口或者抽象类里面只包含一个工厂方法。而抽象工厂方法的工厂接口或者抽象类里，包含有多个工厂方法，可以返回不同类型的产品。这里我们来举一个例子，首先定义一个水果抽象工厂：
```java
public interface FruitFactory {

    Apple getApple();

    Pear getPear();
}
```
可以看到，这个抽象工厂里面有两个工厂方法，返回的是不同种类的产品，但是这两种产品具有相关性(都是水果)。然后我们实现这个接口，跟工厂方法模式的想法一样，为的是在子类中实例化产品
```java
public class Factory1 implements FruitFactory {
    @Override
    public Apple getApple() {
        return new Apple1();
    }

    @Override
    public Pear getPear() {
        return new Pear1();
    }
}
public class Factory2 implements FruitFactory {
    @Override
    public Apple getApple() {
        return new Apple2();
    }

    @Override
    public Pear getPear() {
        return new Pear2();
    }
}
```
Factory1和Factory2分别返回的是不同的Apple和Pear。这基本上就是工厂方法模式了。

当需要增加一类产品比如Banana时:
1. 新增加Banana接口和产品类，这是正常的也是必须的。
2. 在FruitFactory接口里增加一个getBanana的方法。
3. 在Factory1和Factory2中实现getBanana方法。

可以看到，当我们增加一类产品，需要修改三个文件，这不符合对修改封闭的原则。那抽象工厂方法的优点是什么呢？就是我们只要一开始**具体**使用哪一个工厂，通过这个工厂，我们后面的代码讲与具体产品解耦，都是面向接口的。

### 改进
我们可以使用带反射的简单工厂模式来改进抽象工厂模式。
```java
public class FruitFactory {

    private static final String prefix = "me.ysmull.factory.abstractFactory3.product.";

    public Apple getApple(String className) {
        try {
            Class clazz = Class.forName(prefix + className);
            return (Apple) clazz.newInstance();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Pear getPear(String className) {
        try {
            Class clazz = Class.forName(prefix + className);
            return (Pear) clazz.newInstance();
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}
```
可以看到，每一个工厂方法都是一个使用反射的简单工厂。这样当我们需要新增加一类产品的时候，除去新建的类与接口外，我们只需要在FruitFactory里增加一个加单工厂即可。如果只是增加某一类产品的新品种，那么不需要有代码上的修改。
