---
title: "nlp 中的几种编辑距离"
date: 2024-06-29 07:39:00
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

度量两个字符串之间的距离，基本思路是 dp，均可先列出二维 dp 数组，然后考虑状态转移
```text
  _ w o r d 2
_ 0 1 2 3 4 5
w 1
o 2
r 3
d 4
1 5
```

### 最长公共子串

题目地址: [lintcode 79.最长公共子串](https://www.lintcode.com/problem/79/)

>dp[i][j] 表示 word1 **以 i 结尾**的子串和 word2 **以 j 结尾**的子串，**作为公共子串时**，最长公共子串的长度

* 这里对状态的定义与下面的公共子序列不同，下面是**前i**和**前j**
* 跟同事[胡凡](https://search.jd.com/search?keyword=%E8%83%A1%E5%87%A1)讨论了一下，dp[i][j] 状态的设计，其中 i 和 j 就是方案本身，这一点不能忽略


$$
\mathrm{dp[i][j]} =
\begin{cases}
\mathrm{1 + dp[i-1][j-1]}, & \text{if } \mathrm{word1[i] = word2[j]} \\
0, & \text{if } \mathrm{word1[i] \neq word2[j]}
\end{cases}
$$

> 为什么这个状态转移不用考虑 dp[i-1][j] 和 dp[i][j-1]?

因为 dp[i][j] 的状态设计要求**方案必须以 i 和 j 结尾**，当 word1[i] 和 word2[j] 相等时，根本就无法从 dp[i-1][j] 和 dp[i][j-1] 转移过来，不是不想转，是转不了

```java
public class Solution {
    public int longestCommonSubstring(String a, String b) {
        int lenA = a.length();
        int lenB = b.length();
        int[][] dp = new int[lenA + 1][lenB + 1];
        // 初始化边缘的代码可以省略，因为默认都是 0
        int res = 0;
        for (int i = 1; i <= lenA; i++) {
            for (int j = 1; j <= lenB; j++) {
                if (a.charAt(i-1) == b.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    res = Math.max(res, dp[i][j]);
                } else {
                    dp[i][j] = 0;
                }
            }
        }
        return res;
    }
}
```

### 最长公共子序列

题目地址：[leetcode 1143.最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

>dp[i][j] 表示 word1[0..i]（**前i**） 和 word2[0..j]（**前j**） 的最长公共子序列的长度

注意，这里的定义不是以i结尾，而是前i

$$
\mathrm{dp[i][j]} =
\begin{cases}
\mathrm{\max\{\bcancel{\color{red}{dp[i][j-1],dp[i-1][j]},} dp[i-1][j-1]+1\}}, & \text{if } \mathrm{word1[i] = word2[j]} \\
\mathrm{\max\{\bcancel{\color{red}{dp[i-1][j-1],}} dp[i-1][j], dp[i][j-1]\}}, & \text{if } \mathrm{word1[i] \neq word2[j]}
\end{cases}
$$

上面红线可以去掉，因为:

$$
dp[i-1][j-1] \leq dp[i][j-1] \text{  并且  } dp[i-1][j-1] \leq dp[i-1][j]
$$

$$
dp[i][j-1] \leq dp[i-1][j-1]+1 \text{  并且  } dp[i-1][j] \leq dp[i-1][j-1]+1
$$

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int len1 = text1.length();
        int len2 = text2.length();
        int[][] dp = new int[len1 + 1][len2 + 1];
        // 初始化边缘的代码可以省略，因为默认都是 0
        for (int i = 1; i <= len1; i++) {
            for (int j = 1; j <= len2; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
                }
            }
        }
        return dp[len1][len2];
    }
}
```

### 菜文斯坦距离

题目地址: [leetcode 72.编辑距离](https://leetcode.cn/problems/edit-distance/description/)

可以添加、删除、修改任意字符串中的字符

可以只用以下三种操作：
1. 在 word1 删字符
2. 在 word2 删字符
3. 在 word1 修改字符

>dp[i][j] 表示把 word1[0..i]（**前i**） 和 word2[0..j]（**前j**） 编辑成一样的需要的最小步数

因为操作次序不影响最终答案，每次操作只需要在 i 和 j 处做

$$
\mathrm{dp[i][j]} =
\begin{cases}
\mathrm{\underset{\text{不需要编辑}}{dp[i-1][j-1]}}, & \text{if } \mathrm{word1[i] = word2[j]} \\
\mathrm{1 + \min\{\underset{\text{word1[i]修改为word2[j]}}{dp[i-1][j-1]}, \underset{\text{word1[i]删掉}}{dp[i-1][j]}, \underset{\text{word2[j]删掉}}{dp[i][j-1]}\}}, & \text{if } \mathrm{word1[i] \neq word2[j]}
\end{cases}
$$

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int len1 = word1.length();
        int len2 = word2.length();
        int[][] dp = new int[len1 + 1][len2 + 1];
        for (int i = 1; i <= len1; i++) {
            dp[i][0] = i;
        }
        for (int j = 1; j <= len2; j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= len1; i++) {
            for (int j = 1; j <= len2; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(Math.min(dp[i - 1][j - 1], dp[i][j - 1]), dp[i - 1][j]);
                }
            }
        }
        return dp[len1][len2];
    }
}
```
