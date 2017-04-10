---
layout: post
title: Builder Pattern
date: 2017-04-10 20:05:15
tags:
    - design_pattern
---

* toc
{:toc}
## Definition
>The intent of the Builder design pattern is to separate the construction of a complex object from its representation. By doing so the same construction process can create different representations.

## Structure
* **Product** 表示被构造的复杂对象
* **Builder** 指定 `Product` 各个部件的创建过程的接口(或抽象类)
* **ConcreteBuilder** 实现`Builder`
* **Director** 使用Builder的实例实际创建一个`Product`

说明：
1. `Builder`处理`Director`的请求。
2. `Client`从`Director`获取`Product`。
3. `Builder` 和 `ConcreteBuilder` 都不应该有部件的具体业务数据，它们只负责抽象的创建过程。具体的数据只出现在`Director`。
4. `Builder` 的组件方法的返回类型设定为Builder类本身可以实现 ***fluent interface***

## Practice

### ordinary version
```java
// Product
@Data // using Lombok
class Car {
    private int wheels;
    private String color;
}
```
```java
// Builder
interface CarBuilder {
    CarBuilder setWheels(final int wheels);

    CarBuilder setColor(final String color);

    Car build();
}
class CarBuilderImpl implements CarBuilder {
    private Car car;

    public CarBuilderImpl() {
        car = new Car();
    }

    @Override
    public CarBuilder setWheels(final int wheels) {
        car.setWheels(wheels);
        return this;
    }

    @Override
    public CarBuilder setColor(final String color) {
        car.setColor(color);
        return this;
    }

    @Override
    public Car build() {
        return car;
    }
}
```
```java
// Director
public class CarBuildDirector {
    private CarBuilder builder;

    public CarBuildDirector(final CarBuilder builder) {
        this.builder = builder;
    }

    public Car construct() {
        return builder.setWheels(4)
                      .setColor("Red")
                      .build();
    }

    public static void main(final String[] arguments) {
        CarBuilder builder = new CarBuilderImpl();
        CarBuildDirector carBuildDirector = new CarBuildDirector(builder);
        System.out.println(carBuildDirector.construct());
    }
}
```

### Generic Version
我们可以使用Java8实现一个泛型的Builder,很强大！
```java
public class GenericBuilder<T> {

    private final Supplier<T> instantiator;

    private List<Consumer<T>> instanceModifiers = new ArrayList<>();

    public GenericBuilder(Supplier<T> instantiator) {
        this.instantiator = instantiator;
    }

    public static <T> GenericBuilder<T> of(Supplier<T> instantiator) {
        return new GenericBuilder<T>(instantiator);
    }

    public <U> GenericBuilder<T> with(BiConsumer<T, U> consumer, U value) {
        Consumer<T> c = instance -> consumer.accept(instance, value);
        instanceModifiers.add(c);
        return this;
    }

    public T build() {
        T value = instantiator.get();
        instanceModifiers.forEach(modifier -> modifier.accept(value));
        instanceModifiers.clear();
        return value;
    }

    public static void main(String[] args) {
        Car car = GenericBuilder.of(Car::new)
                .with(Car::setColors, "red")
                .with(Car::setWheels, 5)
                .build();
    }
}
```

## Reference
1. [wikipedia builder pattern][1]{:target="_blank"}
2. [how-to-implement-the-builder-pattern-in-java-8][2]{:target="_blank"}

[1]: https://en.wikipedia.org/wiki/Builder_pattern#Java "a"
[2]: http://stackoverflow.com/questions/31754786/how-to-implement-the-builder-pattern-in-java-8 "b"
