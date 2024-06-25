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
\mathrm{dp[i]= max\{dp[i-1] + nums[i], nums[i]\}}
$$


