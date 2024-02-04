---
title: "如何进行二分查找"
date: 2021-01-23 20:30:00
method_id: 二分查找
method: true
alg_tag: 模板
tags:
  - 方法学习
---

## 模板

想要知道数学推导，请参考[[1]][1]

```java
// 搜索 nums 数组中 [begin, end)
// 如果要搜索数组中所有的位置，end 就取 nums.length
int binarySearch(int[] nums, int begin, int end) {
    int l = begin, r = end;
    while (l < r) {
        int mid = l + (r - l) / 2;
        // f 可把 nums 映射为单调非递减的 bool 数组，前 false 后 true
        if (f(nums, mid)) {
            r = mid;
        } else {
            l = mid + 1;
        }
    }
    // 二分结束
    if (l == end) { // 没有搜到
        return -1;
    } else { // 搜到了
        // [begin, end) 中第一个满足 f(m) == true 的位置
        // 如果要返回最后一个为 false 的位置，则返回前 l - 1
        return l;
    }
}
```

## 参考资料

[1]: https://zhuanlan.zhihu.com/p/343138037 "聊聊一看就会一写就跪的二分查找"
[2]: https://www.bilibili.com/video/BV1yW411Z7um "花花酱 LeetCode Binary Search"

