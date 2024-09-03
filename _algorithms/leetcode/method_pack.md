---
title: "背包问题笔记"
date: 2024-09-03 10:13:00
method_id: 动态规划
method: true
math: true
alg_tag: 总结
tags:
  - 方法学习
post: true
---

* toc
{:toc}

## 0-1 背包问题

**问题描述**

有一个背包，容量为 $V$，现有 $N$ 种物品，第 $i$ 种物品占用的体积为 $c_{i}$，价值为 $w_{i}$，求解将哪些物品装入背包可使这些物品的总重量不超过背包容量，且总价值最大。

**状态定义**

设 $dp[i][v]$ 表示前 $i$ 个物品，背包容量为 $v$ 时的最大价值。

### O(VN) 空间复杂度

$$
\begin{aligned}
dp[i][v] 
&= \begin{cases}
dp[i-1][v], & \text{if } v < c_{i}, \text{剩余容积不够，无法放入背包} \\
\max(dp[i-1][v], dp[i-1][v-c_{i}] + w_{i}), & \text{if } v \geq c_{i}, \text{可以放入背包，也可以不放入背包}
\end{cases}
\end{aligned}
$$

初始状态，$dp[0][v] = 0$，$dp[i][0] = 0$，但是一般不需要写，因为默认就是 0。

伪代码如下：
```java
public class Solution {
    public int knapsack(int V, int N, int[] c, int[] w) {
        int[][] dp = new int[N + 1][V + 1];
        for (int i = 1; i <= N; i++) {
            for (int v = 1; v <= V; v++) {
                if (v < c[i]) {
                    dp[i][v] = dp[i - 1][v];
                } else {
                    dp[i][v] = Math.max(dp[i - 1][v], dp[i - 1][v - c[i]] + w[i]);
                }
            }
        }
        return dp[N][V];
    }
}
```

### O(V) 空间复杂度

$$
\begin{aligned}
dp[v]
&= \begin{cases}
dp[v], & \text{if } v < c_{i}, \text{剩余容积不够，无法放入背包} \\
\max(dp[v], dp[v-c_{i}] + w_{i}), & \text{if } v \geq c_{i}, \text{可以放入背包，也可以不放入背包}
\end{cases}
\end{aligned}
$$

化简为：

$$
dp[v] = \max(dp[v], dp[v-c_{i}] + w_{i}) ,\text{ for } v \leftarrow V \text{ to } c_{i} \text{ (}{\color{red}{\textrm{降序遍历}}}\text{)}
$$

伪代码如下：
```java
public class Solution {
    public int knapsack(int V, int N, int[] c, int[] w) {
        int[] dp = new int[V + 1];
        for (int i = 1; i <= N; i++) {
            // 注意，这里必须从大到小遍历
            for (int v = V; v >= c[i]; v--) { 
                dp[v] = Math.max(dp[v], dp[v - c[i]] + w[i]);
            }
        }
        return dp[V];
    }
}
```

注意点：
1. 第二重循环必须从大到小遍历，因为 dp[v] 希望依赖的 dp[v-c[i]] 必须是上一轮 i-1 的值。
```
具体来说，当从大到小遍历的时候：
dp[v]      的 v 是从 V      -> c[i] 遍历的
dp[v-c[i]] 的 v 是从 V-c[i] -> 0    遍历的，所以 dp[v-c[i]] 是上一轮 i-1 的值。
```
2. v 的遍历范围是 $c_{i}$ 到 $V$，因为 $v < c_{i}$ 的时候，$dp[v] = dp[v]$，不需要更新。

### 额外的常数优化

可以看到，刚才的第二轮循环是从 V -> c[i]，但其实 c[i] 还不够紧，我们可以把 c[i] 优化为 $max(c[i], V - \sum_{j=i+1}^{N} c[j])$

```java
public class Solution {
    public int knapsack(int V, int N, int[] c, int[] w) {
        int total = Arrays.stream(c).sum();
        int[] dp = new int[V + 1];
        for (int i = 1; i <= N; i++) {
            total -= c[i - 1];
            int bound = Math.max(c[i], V - total);
            for (int v = V; v >= bound; v--) {
                dp[v] = Math.max(dp[v], dp[v - c[i]] + w[i]);
            }
        }
        return dp[V];
    }
}
```

## 例题

### [LeetCode 474. 一和零](https://leetcode.cn/problems/ones-and-zeroes/description/)

>有一组字符串，每个字符串都是由 0 和 1 组成的，你从这组字符串中尽可能多的挑选字符串，使得所有字符串的 0 和 1 的个数分别不超过 m 和 n，求最多可以挑选多少个字符串。

这道题是一个非常标准的 0 1 背包问题，只不过体积是二维的，0 的个数和 1 的个数，这两个个数分别都不可以超过 m 和 n。

**我们要求的是物品数最大，就把每个物品的价值定义为 1**，即求在背包容量为 m 和 n 的情况下，最多能挑选多少物品。

#### 不降维（60ms）
```java
class Solution {

    public int findMaxForm(String[] strs, int m, int n) {
        int[][][] dp = new int[strs.length + 1][m + 1][n + 1];
        for (int i = 1; i <= strs.length; i++) {
            char[] cs = strs[i - 1].toCharArray();
            int zeros = 0;
            int ones = 0;
            for (char c : cs) {
                if (c == '0')
                    zeros++;
                if (c == '1')
                    ones++;
            }
            for (int p = m; p >= 0; p--) {
                for (int q = n; q >= 0; q--) {
                    if (p - zeros >= 0 && q - ones >= 0) {
                        dp[i][p][q] = Math.max(dp[i - 1][p][q], dp[i - 1][p - zeros][q - ones] + 1);
                    } else {
                        dp[i][p][q] = dp[i - 1][p][q];
                    }
                    
                }
            }
        }
        return dp[strs.length][m][n];
    }
}
```

#### 降维+倒序遍历（23ms）
优化空间复杂度，并注意循环从高到低：

```java
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1];
        for (String s : strs) {
            char[] cs = s.toCharArray();
            int zeros = 0;
            int ones = 0;
            for (char c : cs) {
                if (c == '0')
                    zeros++;
                if (c == '1')
                    ones++;
            }
            for (int p = m; p >= zeros; p--) {
                for (int q = n; q >= ones; q--) {
                    dp[p][q] = Math.max(dp[p][q], dp[p - zeros][q - ones] + 1);
                }
            }
        }
        return dp[m][n];
    }
}
```

#### 降维+倒序遍历+常数优化（14ms）
继续进行常数优化
$count_0(s_i)$ 可以优化为 $max(count_0(s_i), m - \sum_{j=i+1}^{N} count_0(s_j))$
$count_1(s_i)$ 可以优化为 $max(count_1(s_i), n - \sum_{j=i+1}^{N} count_1(s_j))$

```java
class Solution {

    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1];
        int totalZeros = 0;
        int totalOnes = 0;
        for (String s : strs) {
            char[] cs = s.toCharArray();
            for (char c : cs) {
                if (c == '0')
                    totalZeros++;
                if (c == '1')
                    totalOnes++;
            }
        }
        for (String s : strs) {
            char[] cs = s.toCharArray();
            int zeros = 0;
            int ones = 0;
            for (char c : cs) {
                if (c == '0')
                    zeros++;
                if (c == '1')
                    ones++;
            }
            totalZeros -= zeros;
            totalOnes -= ones;
            int zeroBound = Math.max(zeros, m - totalZeros);
            int oneBound = Math.max(ones, n - totalOnes);
            for (int p = m; p >= zeroBound; p--) {
                for (int q = n; q >= oneBound; q--) {
                    dp[p][q] = Math.max(dp[p][q], dp[p - zeros][q - ones] + 1);
                }
            }
        }
        return dp[m][n];
    }
}
```

### [LeetCode 416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/description/)

>给定一个只包含正整数的非空数组。是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

这道题是一个 0 1 背包的变体，是否可以挑选一些物品，使得这些物品刚好装满背包。

背包九讲中提到，如果是要恰好装满背包，则 dp[0] = 0, dp[1]~dp[V] 初始化为负无穷（求最小价值时初始化为正无穷）。(二维情况下 dp[0][0] = 0, dp[0][1]~dp[0][V] 初始化为负无穷)

因为前 0 个物品，才可以 **恰好装满** 容积为 0 的背包，前 0 个物品无法装满容积为 1 ~ V 的背包

所以这道题，我们不需要考虑价值的事情，只需要考虑是否可以恰好装满背包，所以我们可以随便个每个物品一个价值即可，。

注意，这个代码也直接上了常数优化，可轻松击败 99.x%
```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int n : nums) {
            sum += n;
        }
        if (sum % 2 == 1) return false;
        int amount = sum / 2;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MIN_VALUE);
        dp[0] = 0;
        for (int c : nums) {
            sum -= c;
            int bound = Math.max(c, amount - sum);
            for (int v = amount; v >= bound; v--) {
                dp[v] = Math.max(dp[v], dp[v - c] + 1);
            }
        }
        int ans = dp[amount];
        // 负无穷在转移的时候，可能会被 +1，还是负无穷。这里要判断是否得到了合理的价值（选择的物品的个数 > 0）
        return ans > 0;
    }
}
```

由于价值不重要，我们甚至也可以不用求最大价值，转而求最小价值，此时初始化得用 Integer.MAX_VALUE / 2 代表正无穷，最后判断是否小于正无穷即可。

```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int n : nums) {
            sum += n;
        }
        if (sum % 2 == 1) return false;
        int amount = sum / 2;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        for (int c : nums) {
            sum -= c;
            int bound = Math.max(c, amount - sum);
            for (int v = amount; v >= bound; v--) {
                dp[v] = Math.min(dp[v], dp[v - c] + 1);
            }
        }
        int ans = dp[amount];
        return ans < Integer.MAX_VALUE / 2;
    }
}
```

>上面的两个解法，物品的价值都取的是 1，最终的 ans 分别是，最多（或最少）选取**多少个**数字，其和刚好等于 amount

### [LeetCode 494. 目标和](https://leetcode.cn/problems/target-sum/description/)

>给你一个非负整数数组 nums 和一个整数 target 。
>向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个表达式 ：
> 
> 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
> 返回可以通过上述方法构造的、运算结果等于 target 的不同表达式的数目。

分析：
```text
添加 + 号的数字的和为 sumPos
添加 - 号的数字的和为 sumNeg

-sumNeg+sumPos = target
 sumNeg+sumPos = sum

解得：
sumNeg = (sum - target) / 2;
```

根据上面的分析，问题转化为，从数集中选择一些数字，使其和恰好等于 sumNeg，问有多少不同的**方案数**，即**装满背包的方案数**

求方案数的做法：
1. 状态转移时 Max 或 Min 改成 Sum
2. 初始化时，dp[0] = 1, dp[1]~dp[V] 初始化为 0（或者 dp[0][0] = 1, dp[0][1]~dp[0][V] 初始化为 0）

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int n : nums) sum += n;
        if (sum - target < 0 || (sum - target) % 2 == 1) return 0;

        int amount = (sum - target) / 2;
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int n: nums) {
            for (int v = amount; v >= n; v--) {
                dp[v] += dp[v - n];
            }
        }
        return dp[amount];
    }
}
```

求方案数看起来也可以上常数优化

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int n : nums) sum += n;
        if (sum - target < 0 || (sum - target) % 2 == 1) return 0;

        int amount = (sum - target) / 2;
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int n: nums) {
            sum -= n;
            int bound = Math.max(n, amount - sum);
            for (int v = amount; v >= bound; v--) {
                dp[v] += dp[v - n];
            }
        }
        return dp[amount];
    }
}
```

## 完全背包问题

与01背包的不同之处是，每个物品可以重复取，转移方程也只有标红的地方不一样

$$
\begin{aligned}
dp[i][v]
&= \begin{cases}
dp[i-1][v], & \text{if } v < c_{i}, \text{剩余容积不够，无法放入背包} \\
\max(dp[i-1][v], dp[{\color{red}{i}}][v-c_{i}] + w_{i}), & \text{if } v \geq c_{i}, \text{可以放入背包，也可以不放入背包}
\end{cases}
\end{aligned}
$$

降维后的转移方程：

$$
dp[v] = \max(dp[v], dp[v-c_{i}] + w_{i}) ,\text{ for } v \leftarrow c_{i} \text{ to }V \text{ (}{\color{red}{\textrm{升序遍历}}}\text{)}
$$

这里就不去论证这个方程为什么是对的了，具体可以去看背包九讲（反正我看了也没看懂），另外，01背包最后的那个常量优化这里也不可以做了。

## 例题

### [LeetCode 279. 完全平方数](https://leetcode.cn/problems/perfect-squares/description/)

> 给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
> 1 <= n <= 10^4

1. 因为每个完全平方数可以反复选，是完全背包问题，物品是 1^2 ~ 100^2 这 100 个完全平方数
2. 求物品最少个数，定义每个完全平方数的价值为 1
3. 求恰**好装满背包时**的最小价值，所以 dp[0] = 0, dp[1]~dp[V] 初始化为**正**无穷

```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        int k = (int) Math.sqrt(n); // 1^2 ~ k^2
        for (int i = 1; i <= k; i++) {
            int c = i * i;
            for (int v = c; v <= n; v++) {
                dp[v] = Math.min(dp[v], dp[v - c] + 1);
            }
        }
        // 这里不用判断 dp[n] 是否小于正无穷（Integer.MAX_VALUE / 2）
        // 因为任意的 n 最坏也一定可以被 4 个完全平方数表示
        return dp[n];
    }
}
```

### [LeetCode 332. 零钱兑换](https://leetcode.cn/problems/coin-change/description/)

>给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
>计算并返回可以凑成总金额所需的最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
>你可以认为每种硬币的数量是无限的。

1. 首先这题是个完全背包
2. 然后因为是求物品的最小个数，让每个物品的价值为 1，求最小价值即可。
3. 因为要**恰好**装满背包，所以 dp[0] = 0, dp[1]~dp[V] 初始化为**正**无穷。

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE / 2);
        dp[0] = 0;
        for (int c : coins) {
            for (int v = c; v <= amount; v++) {
                dp[v] = Math.min(dp[v], dp[v - c] + 1);
            }
        }
        return dp[amount] < Integer.MAX_VALUE / 2 ? dp[amount] : -1;
    }
}
```

### [LeetCode 518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-ii/description/)

> 给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。
> 请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。
> 假设每一种面额的硬币有无限个。 

1. 首先这题是个完全背包
2. 要求的是**装满背包的方案数**，所以转移方程的 Max 或者 Min 需要改成 Sum，并且 dp[0] = 1（或者二维时 dp[0][0] = 1），其它为 0。

```java
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int c : coins) {
            for (int v = c; v <= amount; v++) {
                dp[v] += dp[v - c];
            }
        }
        return dp[amount];
    }
}
```

## 总结

不论是 01 背包还是完全背包：

1. 求最大(最小)物品个数，就定义每个物品的价值为 1，求最大或最小价值即可，状态转移时用 Max 或 Min
2. 求恰好装满背包的方案数，不需要定义价值，状态转移时用 Sum，初始化时 dp[0] = 1，其它为 0
3. 求恰好装满背包的最大（最小）价值，初始化时 dp[0] = 0，dp[1~V] 取负无穷（正无穷）
   * Java 里，负无穷用 Integer.MIN_VALUE，合法的价值要根据题意来看，远大于负无穷，比如如果是物品的个数时，合法的价值要大于 0
   * Java 里，正无穷用 Integer.MAX_VALUE / 2，合法的价值只需要判断是小于 Integer.MAX_VALUE / 2 的即可

01 背包，不论是求方案数还是求最优价值，都可以上常数优化。
