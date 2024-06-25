---
title: "数组日经题总结"
date: 2024-06-24 22:58:00
method_id: 动态规划
method: true
math: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}


### 56.合并区间

按照区间的左端点排序，那么在排完序的列表中，可以合并的区间一定是连续的

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        List<int[]> res = new ArrayList<>();
        // 这个别忘了写法
        Arrays.sort(intervals, (int[] a, int[] b) -> a[0] - b[0]);
        for (int i = 0; i < intervals.length; i++) {
            if (res.size() == 0) {
                res.add(intervals[i]);
            } else {
                int l = intervals[i][0];
                int r = intervals[i][1];
                int lastl = res.get(res.size() - 1)[0];
                int lastr = res.get(res.size() - 1)[1];
                if (l > lastr) {
                    res.add(intervals[i]);
                } else {
                    // [[1,4] [2,3]]，左边界一定用上一个区间的，右边界要比较下，用较大的
                    res.set(res.size() - 1, new int[]{lastl, Math.max(lastr, r)});
                }
            }
        }
        // 这个也别忘了写法
        return res.toArray(new int[res.size()][]);
    }
}
```


