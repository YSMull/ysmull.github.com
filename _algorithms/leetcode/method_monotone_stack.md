---
title: "单调栈总结"
date: 2024-06-21 18:32:00
method_id: 单调栈
method: true
alg_tag: 总结
math: true
tags:
  - 方法学习
---

* toc
{:toc}

### 模板


```java
class Solution {
    public int solve(int[] nums) {
        // 栈内可以存元素下标，也可以存元素本身
        Deque<Integer> stack = new LinkedList<Integer>();
        int n = height.length;
        for (int i = 0; i < n; ++i) {
            // 这里的性质是特化的，nums[i] 与 站顶元素的比较
            while (!stack.isEmpty() && 性质不满足时) {
                // 收缩窗口，直到满足，有时也可以直接 clear
                int top = stack.pop();
                if (stack.isEmpty()) { // 如果下面还要 peek 的话
                    break;
                }
                // 收缩更新当前最新答案
            }
            // right++
            // 也可以在这里更新答案
            stack.push(i);
            
        }
        return ans;
    }
}
```

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
            if (!s.isEmpty() && nums[i] <= s.peek()) {
                max = Math.max(s.size(), max);
                s.clear();
            }
            s.push(nums[i]);
        }
        return Math.max(max, s.size());
    }
}
```

### 128.最长连续序列

#### 动态规划

$$
dp[i] =
\begin{cases}
dp[i-1] + 1 & \text{if } nums[i] = nums[i-1] + 1 \\
dp[i-1] & \text{if } nums[i] = nums[i-1] \\
1 & \text{otherwise}
\end{cases}
$$

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) return 0;
        Arrays.sort(nums);
        int[] dp = new int[nums.length];
        int max = 1;
        dp[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i-1] + 1) {
                dp[i] = dp[i-1] + 1;
            } else if (nums[i] == nums[i-1]) {
                dp[i] = dp[i-1];
            } else {
                dp[i] = 1;
            }
            if (dp[i] > max) {
                max = dp[i];
            }
        }
        return max;
    }
}
```

#### 单调栈做

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) return 0;
        Arrays.sort(nums);
        LinkedList<Integer> s = new LinkedList<>();
        int cur = 0;
        int max = 0;
        for (int i = 0; i < nums.length; i++) {
            int n = nums[i];
            if (!s.isEmpty() && n != s.peek() && n != s.peek() + 1) {
                s.clear();
                cur = 0;
            }
            if (s.isEmpty() || n == s.peek() + 1) {
                max = Math.max(++cur, max);
            }
            s.push(n);
        }
        return max;
    }
}
```
