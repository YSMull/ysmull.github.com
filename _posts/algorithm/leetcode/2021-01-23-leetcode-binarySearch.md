---
layout: post
title: "如何进行二分查找"
date: 2021-01-23 20:30:00
method_id: 二分查找
tags:
    - oj
    - 方法学习
---

## 模板

记住这个模板，它返回的是: **第一个满足 `f(m) == true` 的位置**。

想要知道数学推导，请参考[[1]][1]
想要知道模板的应用，请参考[[2]][2]

```java
class Solution {
    public int binarySearch(int[] nums) {
        int l = 0, r = nums.length;
        if (l < r) {
            int m = l + (r - l) / 2;
            if (f(m)) {
                r = m;
            } else {
                l = m + 1;
            }
        }
        return l;
    }
}
```

## 参考资料

[1]: https://mp.weixin.qq.com/s/hJMfH4hSsT8sgdb5J2D2lA "聊聊一看就会一写就跪的二分查找"
[2]: https://www.bilibili.com/video/BV1yW411Z7um "花花酱 LeetCode Binary Search"

