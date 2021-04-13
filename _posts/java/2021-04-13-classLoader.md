---
layout: post
title: "Java 中如何做类隔离"
date: 2021-04-13 19:35:00
tags: ["jvm", "classloader"]
---

* toc
{:toc}

## 准备被依赖模块

### 模块A 1.0

```java
package com.youdata;

public class A {

    static {
        System.out.println("A 1.0 loaded");
    }

    public static void printVersion() {
        System.out.println("I am A 1.0");
    }

    public static void printDepVersion() {
        B.printVersion();
    }
}
```

```xml
<dependencies>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>B</artifactId>
    <version>1.0</version>
  </dependency>
</dependencies>
```

### 模块A 2.0

```java
package com.youdata;

public class A {

    static {
        System.out.println("A 2.0 loaded");
    }

    public static void printVersion() {
        System.out.println("I am A 2.0");
    }

    // 新版通过反射调用
    public static void printDepVersion() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Method printVersionNew = B.class.getMethod("printVersionNew");
        printVersionNew.invoke(null);
    }
}
```

```xml
<dependencies>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>B</artifactId>
    <version>1.0</version>
  </dependency>
</dependencies>
```

### 模块B 1.0

```java
package com.youdata;

public class B {

    static {
        System.out.println("B 1.0 loaded");
    }

    public static void printVersion() {
        System.out.println("I am B 1.0");
    }
}
```

### 模块B 2.0

```java
package com.youdata;

public class B {

    static {
        System.out.println("B 2.0 loaded");
    }

    public static void printVersionNew() { // 方法名改了
        System.out.println("I am B 2.0");
    }
}
```

## 调用方（使用 Maven 加载依赖）

```java
package com.youdata;

public class Main {
    public static void main(String[] args) {
        A.printVersion();
        A.printDepVersion();
    }
}
```

```xml
<dependencies>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>A</artifactId>
    <version>1.0</version>
  </dependency>
</dependencies>
```

我们运行一下：
```text
A 1.0 loaded
I am A 1.0
Exception in thread "main" java.lang.NoClassDefFoundError: com/youdata/B
	at com.youdata.A.printDepVersion(A.java:14)
	at com.youdata.Main.main(Main.java:7)
Caused by: java.lang.ClassNotFoundException: com.youdata.B
	at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
	at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:355)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
	... 2 more
```
报错原因是因为 A 在执行 B 的静态方法时，找不到类 B，从而无法加载类 B，我们在 pom.xml 中引入 B 这个依赖，并重新运行：
```xml
<dependencies>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>A</artifactId>
    <version>1.0</version>
  </dependency>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>B</artifactId>
    <version>1.0</version>
  </dependency>
</dependencies>
```
```text
A 1.0 loaded
I am A 1.0
B 1.0 loaded
I am B 1.0
```

如果我们把 B 的依赖版本升级到 2.0，重新运行时，A 会调用 B 2.0 版本的静态方法：

```xml
<dependencies>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>A</artifactId>
    <version>1.0</version>
  </dependency>
  <dependency>
    <groupId>com.youdata</groupId>
    <artifactId>B</artifactId>
    <version>2.0</version>
  </dependency>
</dependencies>
```

```text
A 1.0 loaded
I am A 1.0
B 2.0 loaded
I am B 2.0
```

可以看到，使用 Maven 的方式，调用方声明自己需要一个 A 模块，如果不提供 B 模块的任何一个版本，A 模块是无法正常工作的。

当我们提供 1.0 版本的 B 模块，A 就是用 1.0 的 B 模块工作，当我们提供 2.0 版本的 B 模块，A 就是用 2.0 的 B 模块工作。



## 调用方（用类加载器同时加载多版本类）

我们改造调用方的项目结构如下，使用 URLClassLoader 同时加载指定路径的所有 jar 包。

```text
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── youdata
        │           └── Main.java
        └── resources
            └── lib
                ├── 1.0
                │   ├── A-1.0.jar
                │   └── B-1.0.jar
                └── 2.0
                    ├── A-2.0.jar
                    └── B-2.0.jar

```

```java
package com.youdata;

import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.stream.Stream;

public class Main {

    public static Class<?> loadClassA(String jarPath, ClassLoader loader) throws Exception {
        String lib = Main.class.getClassLoader().getResource(jarPath).getPath();
        Stream<Path> walk = Files.walk(Paths.get(lib));
        URL[] jars = walk.filter(f -> f.getFileName().toString().endsWith(".jar"))
            .map(p -> {
                try {
                    return p.toUri().toURL();
                } catch (MalformedURLException e) {
                    return null;
                }
            }).filter(Objects::nonNull).toArray(URL[]::new);
        URLClassLoader classLoader = new URLClassLoader(jars, loader);
        return classLoader.loadClass("com.youdata.A");
    }

    public static void invokeAsMethod(Class<?> aClass) throws Exception {
        Method printVersion = aClass.getMethod("printVersion");
        printVersion.invoke(null);
        Method printDepVersion = aClass.getMethod("printDepVersion");
        printDepVersion.invoke(null);
        System.out.println();
    }

    public static void loadClassInNewThread(String jarPath) {
        new Thread(() -> {
            try {
                Class<?> aClass = loadClassA(jarPath, Thread.currentThread().getContextClassLoader());
                while (true) {
                    invokeAsMethod(aClass);
                    Thread.sleep(2000);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    public static void main(String[] args) throws InterruptedException {
        loadClassInNewThread("lib/1.0");
        Thread.sleep(1000); // 时间上错位打印
        loadClassInNewThread("lib/2.0");
    }
}
```

```text
A 1.0 loaded
I am A 1.0
B 1.0 loaded
I am B 1.0

A 2.0 loaded
I am A 2.0
B 2.0 loaded
I am B 2.0

I am A 1.0
I am B 1.0

I am A 2.0
I am B 2.0

I am A 1.0
I am B 1.0

I am A 2.0
I am B 2.0

I am A 1.0
I am B 1.0

...
```

我们可以把 jar 包修改一下，让 2.0 目录下的 A-2.0.jar 使用 B-1.0.jar:

```text
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── youdata
        │           └── Main.java
        └── resources
            └── lib
                ├── 1.0
                │   ├── A-1.0.jar
                │   └── B-1.0.jar
                └── 2.0
                    ├── A-2.0.jar
                    └── B-1.0.jar     <====== 修改为 B-1.0.jar
```

重新执行代码：

```java
A 1.0 loaded
I am A 1.0
B 1.0 loaded
I am B 1.0

A 2.0 loaded
I am A 2.0
B 1.0 loaded    <======= 注意 1.0 的 B 第二次被 load
I am B 1.0

I am A 1.0
I am B 1.0

I am A 2.0
I am B 1.0

I am A 1.0
I am B 1.0

I am A 2.0
I am B 1.0

I am A 1.0
I am B 1.0

I am A 2.0
I am B 1.0

```

实验发现：
1. 把 `Thread.currentThread().getContextClassLoader()` 换成 `Main.class.getClassLoader()` 甚至换成 `null` 也是 work 的。
2. 去掉 sleep，每一次循环都重新加载类并且，两个线程并发运行，也不会发生调用错误。
```java
public static void loadClassInNewThread(String jarPath) {
    new Thread(() -> {
        try {
            while (true) {
                Class<?> aClass = loadClassA(jarPath, null);
                invokeAsMethod(aClass);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
}
```