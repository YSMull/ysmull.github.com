---
layout: post
title: Singleton Pattern
date: 2017-04-12 10:48:25
tags:
    - design_pattern
---

* toc
{:toc}

## Intent
>Ensure a class has only one instance, and provide a global point of access to it.
>
>确保一个类只有一个实例，并提供一个全局访问点。

## Implements
### Eager initialization
```java
public class Singleton {
  public static Singleton instance = new Singleton();

  private Singleton() {}

  public static Singleton getInstance() {
      return instance;
  }
}
```
说明: 构造函数声明为private是为了防止用new创建类的实例。

### Lazy initialization I
只有第一次调用`getInstance()`方法才会创建实例。
```java
public final class Singleton {
    private static Singleton instance = null;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
### Lazy initialization II
[*Lazy initialization I*](#id-lazy-initialization-i) 的实现在多线程环境下可能会产生多个实例。比如线程A判断`instance == null`后在执行`new Singleton()`之前，线程B也在判断`instance == null`，这样两个线程调用`getInstance()`返回的是不同的实例。解决办法是加一个重量级锁，保证同一时刻只有一个线程能进入`getInstance()`方法。
```java
public final class Singleton {
    private static Singleton instance = null;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
### Lazy initialization III
[*Lazy initialization II*](#id-lazy-initialization-ii) 的实现虽然解决了可能创建多个实例的问题，但是当instance已经创建完毕后，之后线程每一次调用`getInstance()`获取单例时都需要同步，这会带来性能问题。为了减少同步，我们可以使用`double-checked locking`来减少同步代码块的规模。
```java
public final class Singleton {
  private static volatile Singleton instance = null;

  private Singleton() {}

  public static Singleton getInstance() {
    if (instance == null) { // a
      synchronized(Singleton.class) { // b
        if (instance == null) { // c
          instance = new Singleton();
        }
      }
    }
    return instance;
  }
}
```
说明：
1. 我上面写的这种 *dobule-checked locking* 只适用于java 5+
2. 假设多个线程同时调用`getInstance()`方法，首先在 *a* 处判断instance是否为null，假设大家都判断为null，然后执行到 *b* 处，只有一个线程能进入同步代码块执行 *b* 里面的代码，这个线程创建完instance实例离开同步区后，其它线程就可以一个一个的进入同步代码块了，由于volaile保证了`instance`的**可见性**，当其它线程执行到 *c* 时，会发现instance不为null了，就不会创建新实例。

### Lazy initialization IV
[*Lazy initialization III*](#id-lazy-initialization-iii)已经没什么问题了，但是性能还可以再提高一些。我们可以减少对volatile变量的访问。
```java
public final class Singleton {
  private static volatile Singleton instance = null;

  private Singleton() {}

  public static Singleton getInstance() {
    Singleton result = instance;
    if (result == null) {
      synchronized(Singleton.class) {
        result = instance;
        if (result == null) {
          instance = result = new Singleton();
        }
      }
    }
    return result;
  }

}
```
引入result中间变量，是因为大多数时候，instance已经被实例化了，这样代码对instance的访问就只有一次，《effectiv java》的作者说在他的电脑上这样做相对不引入临时变量，提高了25%的性能。

### Lazy initialization V
参考[[2]][2]
```java
public class Singleton {
    private Singleton() {}

    public static Singleton getInstance() {
        return LazyHolder.instance;
    }

    private static class LazyHolder {
        private static Singleton instance = new Singleton();
    }
}
```
补充说明：
1. 如果我们要延迟加载的是instance filed，考虑使用 *dobule-checked locking*
2. 如果我们要延迟加载的是static filed，考虑使用 *initialize-on-demand holder class*

### Lazy initialization VI
上面的单利模式的实现可能会被反射或者序列化攻击，我们使用enum singleton
```java
public enum Singleton {
    INSTANCE;
}
```
当我们第一次调用`Singleton.INSTANCE`的时候，Singleton就会被加载和初始化，翻译一下就是:
```java
public final class Singleton {
    public final static Singleton INSTANCE = new Singleton();
}
```
这个方法被[[4]][4]的作者认为是单例模式最佳实践。

## Reference
1. [Singleton pattern][1]
2. [Initialization-on-demand holder idiom][2]
3. [Double-checked locking][3]
4. [Effective Java, 2nd Edition.pdf][4]

[1]:https://en.wikipedia.org/wiki/Singleton_pattern
[2]:https://en.wikipedia.org/wiki/Initialization-on-demand_holder_idiom
[3]:https://en.wikipedia.org/wiki/Double-checked_locking
[4]:https://raw.githubusercontent.com/IMCG/books/master/books/Effective%20Java%2C%202nd%20Edition.pdf
