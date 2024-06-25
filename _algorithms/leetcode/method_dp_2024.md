---
title: "dp日经题总结"
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


### 53.最大子数组和

定义 dp[i] 等于以 i 结尾的最大子数组和，则

$$
\mathrm{dp[i]} =
\begin{cases}
\mathrm{dp[i-1] + nums[i]}, & \text{if } \mathrm{dp[i-1] > 0} \\
\mathrm{nums[i]}, & \text{if } \mathrm{dp[i-1] \leq 0}
\end{cases}
$$

或

$$
\mathrm{dp[i]= \max\{dp[i-1] + nums[i], nums[i]\}}
$$

### 198.打家劫舍

如果定义 dp[i] 是最后打劫的是第 i 个房屋的最大盗窃金额，那么转移方程为：

$$
\mathrm{dp[i]} =
\begin{cases}
\mathrm{nums[0]}, &\text{if } i = 0 \\
\mathrm{\max\{nums[0], nums[1]\}}, &\text{if } i = 1 \\
\mathrm{\max\limits_{\substack{k < i - 2}}\{nums[k]\} + nums[i]}, &\text{if } i >= 2\\
\end{cases}
$$

答案需要单独维护一个 max
```java
class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = nums[1];
        int max = Math.max(dp[0], dp[1]);
        for (int i = 2; i < nums.length; i++) {
            for (int j = i-2; j >= 0; j--) {
                dp[i] = Math.max(dp[i], dp[j] + nums[i]);
            }
            
            if (dp[i] > max) {
                max = dp[i];
            }
        }
        return max;
    }
}
```

如果定义 dp[i] 是打劫前 i 个房屋的最大盗窃金额，那么转移方程为：

$$
\mathrm{dp[i] = \max\{dp[i - 2] + nums[i], dp[i-1]\}}
$$

答案是dp[nums.length - 1];
```java
class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length; i++) {
            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
        }
        return dp[nums.length - 1];
    }
}
```


### 300.最长递增子序列

dp[i] 是以第 i 个数字结尾的最长上升子序列，初始值为 1，答案是 dp 数组的最大值

$$
dp[i] = \max_{\substack{0 \leq j\le i \\ nums[i] > nums[j]}}\{dp[j] + 1\}
$$

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] dp = new int[nums.length];
        dp[0] = 1;
        int max = 1;
        for (int i = 1; i < nums.length; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            max = Math.max(max, dp[i]);
        }
        return max;
    }
}
```


