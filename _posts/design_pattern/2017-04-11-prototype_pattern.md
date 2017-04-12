---
layout: post
title: Prototype Pattern
date: 2017-04-11 20:05:15
tags:
    - design_pattern
---

* toc
{:toc}

## Quote
* >Prototype design pattern is used in scenarios where application needs to create a number of instances of a class, which has almost same state or differs very little.

* >Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.

* >当创建给定类的实例很昂贵或很复杂时使用原型模式。---《Head First设计模式》

## Participants
* **Prototype** : the prototype of actual object.
* **Prototype registry** : This is used as registry service to have all prototypes accessible using simple string parameters.
* **Client** : Client will be responsible for using registry service to access prototype instances.

## Practice

定义一个细胞Prototype，`split()`方法表示出分裂(clone)出一个新细胞。
```java
interface Cell extends Cloneable {

    Cell split() throws CloneNotSupportedException;

}
```
分别定义动物细胞和植物细胞
```java
public class AnimalCell implements Cell {

    @Override
    public AnimalCell split() throws CloneNotSupportedException {
        return (AnimalCell) super.clone();
    }

}

public class PlantCell implements Cell {

    @Override
    public PlantCell split() throws CloneNotSupportedException {
        return (PlantCell) super.clone();
    }

}
```
写一个CellRegestry，可以根据不同的细胞类型返回对应的新细胞实例。(有种简单工厂的味道吧？)
```java
public class CellRegestry {

    public enum CellType {
        ANIMAL, PLANT
    }
    private static Map<CellType, Cell> prototypes = new HashMap<>();

    static {
        prototypes.put(CellType.ANIMAL, new AnimalCell());
        prototypes.put(CellType.PLANT, new PlantCell());
    }

    public static Cell getCell(CellType type) throws CloneNotSupportedException {
        // 先根据type获取对应实例，然后clone之
        return prototypes.get(type).split();
    }

}
```
Client使用:
```java
public class Client {
    public static void main(String[] args) {
        try {
            AnimalCell cell1 = (AnimalCell) CellRegestry.getNewCell(CellType.ANIMAL);
            PlantCell cell2 = (PlantCell) CellRegestry.getNewCell(CellType.PLANT);
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```
## Attention
1. Cloneable接口是个**标记接口**(tagging/marker interface)，它没有方法。标记接口的唯一目的是可以用instanceof进行类型检查。
2. 使用 Prototype Pattern 的其中一个原因是因为 clone 比 new 要快，但其实这已经**过时**了，参考[[3]][3]
3. 可以使用*工厂方法模式*或者*复制构造函数*来替代该模式[[4]][4]。
4. 需要注意`深拷贝`和`浅拷贝`的问题。

## Reference
1. [`sourcemaking`: prototype][1]
2. [`howtodoinjava`: prototype-design-pattern-in-java][2]
3. [Java \'Prototype\' pattern - new vs clone vs class.newInstance][3]
4. [cloning vs instantiating a new class][4]

[1]:https://sourcemaking.com/design_patterns/prototype
[2]:http://howtodoinjava.com/design-patterns/creational/prototype-design-pattern-in-java
[3]:http://stackoverflow.com/questions/2427317/java-prototype-pattern-new-vs-clone-vs-class-newinstance
[4]:http://stackoverflow.com/questions/3707612/cloning-vs-instantiating-a-new-class
