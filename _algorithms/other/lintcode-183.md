---
title: "木材加工"
date: 2024-02-02 14:40:45
lintcode_id: 183
tags:
  - lintcode
difficult: hard
parent_id:
  - __二分查找

---

这题虽然是 hard，但会用模板的话，是个 easy 题，为什么可以秒，参考代码注释
```js
export class Solution {
    // 左闭右开的二分模板
    // f 可以使得区间 begin ~ end 变成单调非递减的 bool 数组（假设 false < true 的话）
    binSearch(begin, end, f) {
        let l = begin, r = end;
        while (l < r) {
            let mid = l + Math.floor((r - l) / 2);
            // 有的题目，f 需要额外传入 l 和 r
            if (f(mid, l, r)) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l;
    }

    woodCut(L, k) {
        // step1: 构造 f =>
        // 从长度为 1 开始切，至少能切出这么多块木头为 false，切不出来这么多块木头为 true
        // 变成前 false 后 true 形状
        // 如果搜到了为 true 的位置，取前一个为 false 的位置，就是最大的为 false 的位置
        let f = mid => mostPartNum = L.reduce((count, cur) => count + Math.floor(cur / mid), 0) < k;

        // step2: 确定搜索区间
        // 因为 maxLen+1 是一个合法的为 true 的位置（maxLen 是合法的最大的为 false 的位置）
        // 所以我们让右开的位置, 即没有搜索到时的结束位置取 maxLen+2
        let maxLen = Math.max(...L);
        let l = this.binSearch(1, maxLen + 2, f);

        // step3: 收尾处理，看搜没有搜到，如果搜到了，可能要额外处理
        if (l === maxLen + 2) { // 没搜到，则停留在 maxLen + 2 的位置
            return 0;
        } else { // 搜到了，返回最后一个为 false 的位置
            return l - 1;
        }
    }
}
```
