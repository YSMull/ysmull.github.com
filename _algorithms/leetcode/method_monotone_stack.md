---
title: "单调栈总结"
date: 2024-06-21 18:32:00
method_id: 单调栈
method: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}



### 42.接雨水(hard)

#### 动态规划预处理 
1. 遍历算出每个元素左边最大的元素数组（包含自己）
2. 遍历算出每个元素右边最大的元素数组（包含自己）
3. 遍历，计算每个元素左边和右边最大的元素中较小者，减去自己，就是当前格子的雨水高度

注意，1 和 2 如果不包括自己，那么在 3 中需要判断减去自己是否大于 0，如果大于 0，那么就把这个值加到 sum 中

```java
class Solution {
    public int trap(int[] height) {
        int[] maxLeft = new int[height.length];
        int[] maxRight = new int[height.length];
        maxLeft[0] = height[0];
        maxRight[height.length - 1] = height[height.length - 1];
        for (int i = 1; i < height.length; i++) {
            maxLeft[i] = Math.max(maxLeft[i-1], height[i]);
        }
        for (int i = height.length - 2; i >= 0; i--) {
            maxRight[i] = Math.max(maxRight[i+1], height[i]);
        }
        int sum = 0;
        for (int i = 1; i < height.length - 1; i++) {
            sum += Math.min(maxLeft[i], maxRight[i]) - height[i];
        }
        return sum;
    }
}
```

#### 单调栈

站顶到栈底单调递增，push 一个元素，如果破坏了单调性，那么破坏单调性的这个元素，与站顶的下一个元素，可以把栈顶夹出一些雨水

比如：
```text
假设 b < c < d
stack:
b
c
d
```

此时插入的 a > b && a > c && a < d，则 b、c 一次出栈:

* b 出栈，a 与 c 夹住 b 能夹出一些雨水
* c 出栈，a 与 d 夹住 c 能夹出一些雨水

1 1 0 1

```java
class Solution {
    public int trap(int[] height) {
        int ans = 0;
        Deque<Integer> stack = new LinkedList<Integer>();
        int n = height.length;
        for (int i = 0; i < n; ++i) {
            while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
                int top = stack.pop();
                if (stack.isEmpty()) {
                    break;
                }
                int left = stack.peek();
                int currWidth = i - left - 1;
                int currHeight = Math.min(height[left], height[i]) - height[top];
                ans += currWidth * currHeight;
            }
            stack.push(i);
        }
        return ans;
    }
}
```

### 674.最长连续递增序列

强行用单调栈做也是可以的

```java
class Solution {
    public int findLengthOfLCIS(int[] nums) {
        LinkedList<Integer> s = new LinkedList<>();
        int max = -1;
        for (int i = 0; i < nums.length; i++) {
            while (!s.isEmpty() && nums[i] <= s.peek()) {
                max = Math.max(s.size(), max);
                s.clear();
            }
            s.push(nums[i]);
        }
        return Math.max(max, s.size());
    }
}
```
