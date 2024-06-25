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
\mathrm{\max\limits_{\substack{0 \leq k < i - 2}}\{nums[k]\} + nums[i]}, &\text{if } i >= 2\\
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

如果定义 dp[i] 是打劫前 i 个房屋的最大盗窃金额，因为 dp[i] 不确定 i 到底打劫不打劫，所以需要分类讨论分为了两个情况
1. 如果 i 打劫，则盗窃金额为 dp[i-2] + nums[i]
2. 如果 i 不打劫，则盗窃金额为 dp[i-1]

转移方程为：

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

#### O(n^2) 的解法
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

#### O(nlogn) 解法

参考[这篇文章](https://writings.sh/post/longest-increasing-subsequence-revisited)

维护一个 tails 数组，tails[i] 表示长度 i+1 的上升子序列的最小结尾，可以证明 tails 一定是单调递增的

* 如果 nums[i] 大于了 tails 的最后一个元素，那么 tails 也增加一个元素，最长上升序列的长度相应的变大
* 如果 nums[i] 小于等于 tails 的最后一个元素，那么 tails 中第一个大于 nums[i] 的位置 j 的值可以被更新为 nums[i]（二分），这样**长度为 j + 1 的子序列又被压低了一些**

tails 的思路是，尽可能的维护一个结尾尽可能小的上升子序列，最后答案是 tails 数组的长度

注意 tails 数组不一定就是最长上升子序列本身，因为上面第二种情况，更新了 tails[j] 之后，tails[j] 的元素下标可能在 tails[j+1] 的元素之后

比如 [2, 6, 8, 10, 3, 9, 10]，这个序列

```text
tails 数组变化情况
2
2,6
2,6,8
2,6,8,10
2,3,8,10
2,3,8,9
2,3,8,9,10 // 并不是子序列
```

代码如下：

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        tails.add(nums[0]);
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > tails.get(tails.size() - 1)) { // 扩充 tails，长度增长 1
                tails.add(nums[i]);
            } else { // 二分查找第一个大于 nums[i] 位置，更新 tails 数组
                int l = 0, r = tails.size();
                while (l < r) {
                    int mid = l + (r - l) / 2;
                    if (tails.get(mid) >= nums[i]) {
                        r = mid;
                    } else {
                        l = mid + 1;
                    }
                }
                tails.set(l, nums[i]);
            }
        }
        return tails.size();
    }
}
```

也可以简化代码，直接从 i = 0 开始，并且 for 循环里直接开始二分，但是没啥必要，上面的代码可以了

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            int l = 0, r = tails.size();
            while (l < r) {
                int mid = l + (r - l) / 2;
                if (tails.get(mid) >= nums[i]) {
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            if (l == tails.size()) {
                tails.add(nums[i]);
            } else {
                tails.set(l, nums[i]);
            }
        }
        return tails.size();
    }
}
```




### 121.买卖股票的最佳时机
一个数组，只能买一次，只能卖一次，求最多能赚多少

最开始，我的想法是，对于每个买入时机，如果能知道未来最高是多少钱，就能计算此时买入最多可以赚多少，不过代码很繁琐，没必要看，搞反了，应该计算每个 i 左边的最小值

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length <= 1) return 0;
        int[] maxRight = new int[prices.length - 1];
        maxRight[prices.length - 2] = prices[prices.length - 1];
        for (int i = prices.length - 3; i >= 0; i--) {
            maxRight[i] = Math.max(maxRight[i + 1], prices[i + 1]);
        }
        int maxProfit = 0;
        for (int i = 0; i < prices.length - 1; i++) {
            maxProfit = Math.max(maxProfit, maxRight[i] - prices[i]);
        }
        return maxProfit;
    }
}
```

第二个思路是 leetcode 官方思路，每一天都尝试卖，维护这一天之前的史低价格是多少，看卖了能赚多少，不断更新最大值。
```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int i = 0; i < prices.length; i++) {
            if (prices[i] < minPrice) { // 更新史低价格
                minPrice = prices[i];
            } else { // 用当前价格减去的历史新低
                maxProfit = Math.max(maxProfit, prices[i] - minPrice);
            }
        }
        return maxProfit;
    }
}
```

如果当天买当天是无效的，对 maxProfit 没影响，代码可以写成这样：
```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int i = 0; i < prices.length; i++) {
            minPrice = Math.min(minPrice, prices[i]); // 维护历史最低价
            maxProfit = Math.max(maxProfit, prices[i] - minPrice); // 卖一下试试
        }
        return maxProfit;
    }
}
```



### 121.买卖股票的最佳时机II

#### 动态规划

设 dp[i][0] 是第 i 天没有持有股票的最大利润，dp[i][1] 是第 i 天持有股票的最大利润

$$
dp[i][0] = \max\{dp[i-1][1] + prices[i], dp[i-1][0]\} \text{  }(当天卖出)
$$

$$
dp[i][1] = \max\{dp[i-1][0] - prices[i], dp[i-1][1]\} \text{  }(当天买入)
$$

```java
class Solution {
    public int maxProfit(int[] prices) {
        int[][] dp = new int[prices.length][2];
        dp[0][0] = 0;
        dp[0][1] = -prices[0];
        for (int i = 1; i < prices.length; i++) {
            dp[i][0] = Math.max(dp[i-1][1] + prices[i], dp[i-1][0]);
            dp[i][1] = Math.max(dp[i-1][0] - prices[i], dp[i-1][1]);
        }
        return dp[prices.length - 1][0];
    }
}
```

#### 贪心法
一个数组，可以买卖多次，每天可以同时买和卖

只要相邻两天有递增，这个利润就收入囊中（让前一天买，后一天卖），否则不操作。
```java
class Solution {
    public int maxProfit(int[] prices) {
        int res = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i-1]) {
                res += prices[i] - prices[i-1];
            }
        }
        return res;
    }
}
```
