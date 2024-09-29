---
layout: post
title: "理解 Java 中的 ThreadLocal"
date: 2019-08-03 19:35:00
tags: ["jvm", "multi thread"]
hide: false
---

* toc
{:toc}

## 引子

我们有了一个线程
~~~ java
Thread t = new Thread();
~~~

我们希望放置一些数据，使得在该线程的任何地方都可以访问和修改这些数据，这就是 ThreadLocal 对象。理所应当的，我们应该把这个些数据存放在当前 Thread 的对象上，这也就是为什么 Thread 类上有一个 threadLocals 字段，它的类型是 ThreadLocalMap，ThreadLocalMap 顾名思义是一个 Map，key 为 ThreadLocal 对象，value 是我们要存储的对象。
~~~java
/* ThreadLocal values pertaining to this thread. This map is maintained
 * by the ThreadLocal class. */
ThreadLocal.ThreadLocalMap threadLocals = null;
~~~
{: .line-numbers }

每一个 threadLocal 对象只能存放「一个东西」。如果你想存放苹果，再存放书，得分别为要存放的东西创建 ThreadLocal 对象：
```java
ThreadLocal<Apple> appleThreadLocal = new ThreadLocal<>();
ThreadLocal<Book> bookThreadLocal = new ThreadLocal<>();
```
不过，到目前为止，仍然是什么特殊的事情都没有发生，因为 **ThreadLocal 的构造函数是空的** ：
```java
/**
    * Creates a thread local variable.
    * @see #withInitial(java.util.function.Supplier)
    */
public ThreadLocal() {
}
```

多个线程可以使用同一个 ThreadLocal 对象：
```java
public static ThreadLocal<Apple> appThreadLocal = new ThreadLocal<>();

// thread1                                 // thread2
...                                        ...
Apple apple1 = new Apple();                Apple apple2 = new Apple();
appThreadLocal.set(apple1);                appThreadLocal.set(apple2);
...                                        ...
appThreadLocal.get(); // apple1            appThreadLocal.get(); // apple2
```

在整个 Thread.java 的源码中，只有 exit() 方法使用到了 threadLocals
```java
private void exit() {
    ...
    /* Speed the release of some of these resources */
    threadLocals = null;
    ...
}
```
而 threadLocalMap 的初始化，是在第一个 ThreadLocal 对象调用 set 或 get 的时候发生的
~~~
/**
 * Create the map associated with a ThreadLocal. Overridden in
 * InheritableThreadLocal.
 *
 * @param t the current thread
 * @param firstValue value for the initial entry of the map
 */
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
~~~
{: .language-java}


我们来看一下set方法是如何执行的
```java
/**
 * Sets the current thread's copy of this thread-local variable
 * to the specified value.  Most subclasses will have no need to
 * override this method, relying solely on the {@link #initialValue}
 * method to set the values of thread-locals.
 *
 * @param value the value to be stored in the current thread's copy of
 *        this thread-local.
 */
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```
从 `map.set(this, value);` 可以看到，我们把要存储的值放到了 key 为当前 ThreadLocal 对象的 ThreadLocalMap 中去了。取值的时候也是从这个 map 中取，所以问题的关键就在于 ThreadLocalMap 的实现了。

## ThreadLocalMap 的实现

跟 HashMap 类似，也是用数组来实现的
```java
private Entry[] table; 
```
然而这里的Entry 是 WeakReference 的子类
```java
/**
 * The entries in this hash map extend WeakReference, using
 * its main ref field as the key (which is always a
 * ThreadLocal object).  Note that null keys (i.e. entry.get()
 * == null) mean that the key is no longer referenced, so the
 * entry can be expunged from table.  Such entries are referred to
 * as "stale entries" in the code that follows.
 */
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;

    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```

由于弱引用的特性，当 ThreadLocal 对象不可达的时候，ThreadLocalMap 的 key 就会被 GC 回收掉。试想，如果这里不是弱引用，而是强引用，那么 ThreadLocal 对象将永远不会被回收，除非线程终止。因为 Thread 持有 threadLocals，threadLocals 的 Entry 因为不是弱引用，就会持有 threadLocal 对象的强引用，如果不显式调用 ThreadLocal 的 remove 去掉这里的强引用，**线程生命周期内，threadLocal 就不会被回收**。当线程结束后，Thread 的 exit() 方法会执行 `threadLocals = null` 使得线程内所有的 ThreadLocal 对象以及其上面带有的 value 不可达，导致被回收。不过 exit 方法的注释上说，这里只是为了*加速* 资源的释放，即便线程执行 exit 的时候不释放，线程本身最终也会不可达，所有线程相关的资源最终还是会被回收。

**我再画一幅图解释一下：（人类的本质是复读机！）** 

```java
Thread t // 某一个线程
   ↓
ThreadLocal.ThreadLocalMap t.threadLocals // 线程持有的 Map 对象
   ↓
Entry table[i] // Map 持有的某一个 Entry 对象
```

1. 假设 Entry 持有 key 和 value 的强引用，那么如果 ThreadLocalMap 不自己清理，key 和 value 就会伴随整个 Thread 的生命周期。

2. 假设 Entry 是 key 的弱引用，那么 key 不可达时（也就是 threadLocal 不可达时），key 会被 gc，**value 仍然伴随 Thread 的生命周期。**

那么 ThreadLocal 对象在什么时候才会不可达呢？最简单的情况是，离开了函数调用栈空间了，我们来看下面这个例子
```java
public static void test() {
    ThreadLocal<String> t = new ThreadLocal<>();
    t.set("abc");
}
public static void main(String[] args) {
    new Thread(() -> {
        test();
        // 1
        System.gc();
        // 2
    }).start();
}
```
在线程执行完 test() 方法后，执行 System.gc() 之前，也就是上述代码注释 1 的位置，当前线程的 threadLocals 对象如下：
![](/img/2019-08-03-123120.png)
可以看见 ThreadLocalMap 的 Entry 的 referent 和 value 都还在，当执行 System.gc() 后，我们看一下有什么变化：
![](/img/2019-08-03-123316.png)
此时由于 threadLocal 对象已经不可达，所以会被 gc 回收。然而，**value 对象还没回收呢**！

怎样才能让 value 对象也可以回收呢？**上面已经说过很多次了**，value 对象被回收当且仅当：
1. ThreadLocaMap 自己清理
2. Thread 对象被回收

下面我们来讲解 ThreadLocalMap 什么情况下才会自己清理 key 为 null 的 Entry

在 ThreadLocalMap 类中 ，真正可以回收 value (以及 key) 的方法是 expungeStaleEntry(int staleSlot) 方法：
```java
private int expungeStaleEntry(int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;

    // expunge entry at staleSlot
    tab[staleSlot].value = null;
    tab[staleSlot] = null;
    size--;

    // Rehash until we encounter null
    ...
}
```
这个方法的实现是比较复杂的，不仅直接删除指定 index 的元素，并且在 rehash 的过程中也会清理一些其它的元素。

我们通过 IDE 分析调用链可以知道，只有在 ThreadLocal 的 get 、set、remove 方法被调用时，才有可能会进行清理。

## 注意事项

我们使用 ThreadLocal 最常见的场景是把 ThreadLocal 作为一个类的静态字段（即便不是静态字段，在 IOC 环境下，也可能是个全局的单例对象）多个线程共用同一个 ThreadLocal 对象。（也就是使用同一个 ThreadLocal 对象作为 key 放到各自线程 ThreadLocalMap 里）。

在这种场景下，ThreadLocal 对象的生命周期与承载它的对象的生命周期相同，**在大多数 Web 场景下，这个 ThreadLocal 对象几乎在整个应用的生命周期中都是可达的**。所以每个线程各自的 ThreadLocalMap 的 key 并不会因为使用了弱引用而被 GC 回收掉。我们只能够在每个线程中**手动调用 ThreadLocal 的 remove 方法**对 key 和 value 进行置 null，使得 GC 可以清理掉线程持有的 value（GC 清理不了 key，因为 key 总是可达）。如果不手动调用 remove，那么只有在线程被清理的时候，value 才会被清理（这里说了很多遍了，看不懂请重读上文）。

同时，在 web 场景下，大多数 http server 会使用到线程池，如果在上一次请求中没有主动调用 remove 进行清理，线程池为下一次请求分配的可能是同一个线程，那么调用 ThreadLocal 的 get 方法拿到的就是上一次线程存储的值，这可能会导致错误的业务逻辑。

因此，我们在使用 ThreadLocal 时，应该总是在当前线程结束前手动调用 remove 方法来清理这个线程的 ThreadLocalMap，否则，是有可能内存泄漏的（线程池中的每个线程的 threadLocals 都持有一个相同的 key 的 Entry，以及一个无用的 value）。
