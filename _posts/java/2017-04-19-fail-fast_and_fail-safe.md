---
layout: post
title: "fail-fast and fail-safe Iterator"
date: 2017-04-19 12:57:02
tags: ["java", "collection"]
---


```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.*;

public class Untitled
{

	public static void main(String[] args)
	{
		List<String> list = new ArrayList<String>();
		list.add("apple");
		list.add("pear");
		list.add("banana");

		new Thread(()->{
			while (true) {
			a	try {
					Iterator<String> it = list.iterator();
					while (it.hasNext())
					{
						it.next();
						System.out.println(Thread.currentThread().getName());
					}
				} catch (Exception e) {
					e.printStackTrace();
					break;
				}

			}
		}).start();

		new Thread(()->{
			while (true) {
				if (list.size() == 0) {
					break;
				}
				Iterator<String> it = list.iterator();
				while (it.hasNext())
				{
					it.next();
					it.remove();
					System.out.println(Thread.currentThread().getName());
				}
			}

		}).start();
	}

}
```


[1]:http://javahungry.blogspot.com/2014/04/fail-fast-iterator-vs-fail-safe-iterator-difference-with-example-in-java.html
[2]:http://javaconceptoftheday.com/fail-fast-and-fail-safe-iterators-in-java-with-examples/
[3]:http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/
[4]:https://codereview.stackexchange.com/questions/64011/removing-elements-on-a-list-while-iterating-through-it
