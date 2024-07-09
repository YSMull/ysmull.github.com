---
title: "树形dp总结"
date: 2024-07-09 07:39:00
method_id: 动态规划
method: true
math: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}

## 第一类树形dp
先准备两个题作为工具
**树的深度**
```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

**树的最大链长**
```java
class Solution {
    public int dfs(TreeNode root) {
        if (root == null) return -1;
        return 1 + Math.max(dfs(root.left), dfs(root.right));
    }
}
```
最好用变体，这种用的多一些
```java
class Solution {
    public int dfs(TreeNode root) {
        if (root == null) return -1;
        int l = dfs(root.left) + 1;
        int r = dfs(root.right) + 1;
        return Math.max(l, r);
    }
}
```

### [543. 二叉树的直径(easy)][1]

题目：求二叉树中任意两节点的最大长度

思路：
一定是两个叶子节点之间的长度，两个叶子之间的路径一定会经过某个公共祖先
自底向上，遍历每一个节点，假设路径经过这个节点 root，则:

$$经过root的最大路径长度 = 最大链长(root.left) + 最大链长(root.right) + 2$$

遍历所有节点，更新最大路径长度即可，自底向上进行，可以减少重复计算

```java
class Solution {
    private int max = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return max;
    }
    // 开始树形 dp，注意，dfs 本身求的是最大链长
    public int dfs(TreeNode root) {
        if (root == null) return -1;
        int l = dfs(root.left);
        int r = dfs(root.right);
        max = Math.max(max, l + r + 2); // 当 root 为 没有根的节点是，路径长度为 -1 + -1 + 2 = 0
        return Math.max(l, r) + 1;
    }
    
    // 推荐用这个版本
    public int dfs2(TreeNode root) {
        if (root == null) return -1;
        int l = dfs(root.left) + 1;
        int r = dfs(root.right) + 1;
        max = Math.max(max, l + r); // 当 root 为 没有根的节点是，路径长度为 -1 + -1 + 2 = 0
        return Math.max(l, r);
    }
}
```

### [979. 在二叉树中分配硬币(medium)][2]

题目： n 个节点，每个节点有个 val，所有节点的 val 的和为 n，每次只能让某个节点的值增（减）1，让相邻节点的值减（增）1问最少移动多少次可以让每个节点的 val 为 1

思路：
如果某个子树的节点数等于金币数，那么一定不需要有 1 经过这个子树的根节点。
否则：
* 如果金币数减去节点数是正数，那么一定有金币会经过这个根节点从这棵子树被移出
* 如果金币数减去节点数是负数，那么一定有金币会经过这个根节点被移入这棵树

如果左子树多了 a 个金币，右子树少了 b 个金币，**不用管如何移动，只需考虑整棵树的金币需要从根节点出去或进来多少。**

令 dfs(node) 表示子树 node 金币多了或少了多少个 

$$
\underset{\text{整棵树的金币偏差}}{dfs(node)} = \underset{\text{左子树金币的偏差}}{dfs(node.left)} + \underset{\text{右子树金币的偏差}}{dfs(node.right)} + \underset{\text{本节点金币的偏差}}{node.val - 1}
$$

$$
经过node的搬运次数 = \underset{\text{当前这棵树金币偏差的绝对值}}{\left| dfs(node) \right|}
$$

```java
class Solution {
    private int ans = 0;

    public int distributeCoins(TreeNode root) {
        dfs(root);
        return ans;
    }

    // 返回子树的金币数减去节点数
    public int dfs(TreeNode root) {
        if (root == null) return 0;
        int l = dfs(root.left);
        int r = dfs(root.right);
        ans += Math.abs(l + r + root.val - 1);
        return l + r + root.val - 1;
    } 
}
```

### [124. 二叉树中的最大路径和(hard)][3]

题目：二叉树，每个节点有个整数（可能为负数），任意两个树的节点之间构成一个路径，求所有路径中和最大的

思路：
因为任意一个路径一定会在某个祖先节点拐弯，遍历所有的节点

$$
最大链和(node) = node.val + \underset{\text{如果左右链都是负数就舍弃}}{\max\{0, }\max \{最大链和(node.left),最大链和(node.right)\}\} 
$$

$$
经过node的最大路径和 = 最大链和(root.left) + root.val + 最大链和(root.right)
$$

```java
class Solution {

    private int ans = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        dfs(root);
        return ans;
    }

    // 以 root 节点为起始的最大链和，若为负数，允许空链
    public int dfs(TreeNode root) {
        if (root == null) return 0;
        int l = dfs(root.left);
        int r = dfs(root.right);
        ans = Math.max(ans, l + r + root.val);
        return Math.max(Math.max(root.val + l, root.val + r), 0);
    }
}
```

### [2246. 相邻字符不同的最长路径(hard)][4]
题目：多叉树上每个节点都是一个字符，相邻字符不允许重复的最长字符

思路：
多叉树下，求带约束的直径问题
1. 建树
2. dfs 每棵子树的最长链长
3. 取链长最长的两颗子树的链，与自己构成路径

```java
class Solution {
    private List<Integer>[] g;
    private char[] cs;
    private int max = 0;

    public int longestPath(int[] parent, String s) {
        g = new ArrayList[parent.length];
        cs = s.toCharArray();
        Arrays.setAll(g, e -> new ArrayList<>());

        for (int i = 1; i < parent.length; i++) {
            g[parent[i]].add(i);
        }

        dfs(0);
        return max + 1; // 最长链长 + 1
    }

    // 最长链长
    public int dfs(int n) {
        int lenX = 0;
        for (int c : g[n]) {
            int lenY = dfs(c) + 1; // 注意，这里的递归得在 if 之外
            if (cs[n] != cs[c]) {
                max = Math.max(max, lenX + lenY);
                lenX = Math.max(lenX, lenY);
            }
        }
        return lenX;
    }
}
```

## 第二类树形dp

### [337. 打家劫舍III(medium)][5]
题目：二叉树，相邻节点不能同时偷，求最大偷多少

设 dp[node]\[1\] 表示 node 处偷，dp[node]\[0\] 表示 node 处不偷

$$
\begin{cases}
\mathrm{\underset{\text{偷}}{dp[node][1]} = dp[left][0] + dp[right][0] + node.val} \\
\mathrm{\underset{\text{不偷}}{dp[node][0]} = \max\{dp[left][0],dp[left][1]\} + \max\{dp[right][0],dp[right][1]\}} \\
\end{cases}
$$

> 注意，我写的时候，不偷时，忘记考虑了 left 和 right 也可以都选择不偷

然后我随手写了个超时的（122 / 124 个通过的测试用例），因为有特别多的重复计算
```java
class Solution {

    public int rob(TreeNode root) {
        return Math.max(dfs(root, 0), dfs(root, 1));
    }

    public int dfs(TreeNode root, int rob) {
        if (root == null) return 0;
        if (rob == 1) {
            int l0 = dfs(root.left, 0);
            int r0 = dfs(root.right, 0);
            return l0 + r0 + root.val;
        } else {
            int l0 = dfs(root.left, 0);
            int r0 = dfs(root.right, 0);
            int l1 = dfs(root.left, 1); 
            int r1 = dfs(root.right, 1);
            return Math.max(l0, l1) + Math.max(r0, r1);
        }
    }
}
```

应该这样递归
```java
class Solution {

    public int rob(TreeNode root) {
        int[] res = dfs(root);
        return Math.max(res[0], res[1]);
    }

    // [偷,不偷]
    public int[] dfs(TreeNode root) {
        if (root == null) return new int[]{0, 0};
        int[] l = dfs(root.left);
        int[] r = dfs(root.right);
        return new int[] {Math.max(l[0], l[1]) + Math.max(r[0], r[1]), l[0] + r[0] + root.val};
    }
}
```

### [1377. T 秒后青蛙的位置(hard)][6]
题目：无向树，青蛙每一时刻跳一格，概率均等，跳过的地方不能跳了，如果没地方跳了就只能待在原地，问 t 时刻，处于位置 target 的概率

思路：
1. 构建无向的多叉树
2. 设 dp[t][n] 为 t 时刻处于位置 n 的概率，则

$$
\mathrm{dp[t][n]} =
\begin{cases}
\mathrm{dp[t-1][n]}, & 没有可以跳的位置了 \\
\mathrm{dp[t-1][n] \cdot \frac{1}{k}}, & 还有 k 个可以跳的位置 \\
\end{cases}
$$

初始条件为 dp\[0\]\[1\] = 1，这个解法可以求任意时刻在任意位置的概率

与其他树型dp不同，这个题目得先知道父节点的值，才可以 dfs 到孩子节点进行状态转移

```java
class Solution {
    private List<Integer>[] g;
    private double[][] dp;
    private int maxT;
    private int[] vis;

    public double frogPosition(int n, int[][] edges, int t, int target) {
        g = new ArrayList[n + 1];
        dp = new double[51][n + 1];
        vis = new int[n + 1];
        maxT = t;
        Arrays.setAll(g, e -> new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            g[edges[i][0]].add(edges[i][1]);
            g[edges[i][1]].add(edges[i][0]);
        }
        dp[0][1] = 1;
        vis[1] = 1;
        dfs(0, 1);

        return dp[t][target];
    }

    public void dfs(int t, int n) {
        if (t >= maxT)
            return;

        int childLen = 0;
        for (int c : g[n]) {
            if (vis[c] == 0)
                childLen++;
        }
        if (childLen > 0) {
            for (int c : g[n]) {
                if (vis[c] == 0) {
                    dp[t + 1][c] = dp[t][n] * 1.0 / childLen;
                    vis[c] = 1;
                    dfs(t + 1, c);
                    vis[c] = 0;
                }
            }
        } else {
            dp[t + 1][n] = dp[t][n];
            dfs(t + 1, n);
        }
    }
}
```

注意到每次都乘以小数有精度损失，状态转移时可以考虑每次都乘以 k，最后返回结果时再除，乘法比较大，dp 数组得用 long 类型
```java
class Solution {
    private List<Integer>[] g;
    private long[][] dp;
    private int maxT;
    private int[] vis;

    public double frogPosition(int n, int[][] edges, int t, int target) {
        g = new ArrayList[n + 1];
        dp = new long[t + 1][n + 1];
        vis = new int[n + 1];
        maxT = t;
        Arrays.setAll(g, e -> new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            g[edges[i][0]].add(edges[i][1]);
            g[edges[i][1]].add(edges[i][0]);
        }
        dp[0][1] = 1;
        vis[1] = 1;
        dfs(0, 1);
        return dp[t][target] == 0 ? 0 : (1.0 / dp[t][target]);
    }

    public void dfs(int t, int n) {
        if (t >= maxT)
            return;

        int childLen = 0;
        for (int c : g[n]) {
            if (vis[c] == 0)
                childLen++;
        }
        if (childLen > 0) {
            for (int c : g[n]) {
                if (vis[c] == 0) {
                    dp[t + 1][c] = dp[t][n] * childLen;
                    vis[c] = 1;
                    dfs(t + 1, c);
                    vis[c] = 0;
                }
            }
        } else {
            dp[t + 1][n] = dp[t][n];
            dfs(t + 1, n);
        }
    }
}
```

上面的代码，每次都用了一个 for 循环去求当前还有几条路可以走，而且维护了一个 vis 数组来记录哪里已经走过。其实可以利用树的特性，所以当抵达节点 n 之后，可达区域就是 g[n].size() - 1，唯一的特例是根节点，根节点是 g[n].size()，为了避免这里分类讨论，可以引入一个虚拟节点，根节点也指向了他
```java
class Solution {
    private List<Integer>[] g;
    private long[][] dp;
    private int maxT;

    public double frogPosition(int n, int[][] edges, int t, int target) {
        g = new ArrayList[n + 1];
        dp = new long[t + 1][n + 1];
        maxT = t;
        Arrays.setAll(g, e -> new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            g[edges[i][0]].add(edges[i][1]);
            g[edges[i][1]].add(edges[i][0]);
        }

        g[1].add(0); // 引入一条单向边
        dp[0][1] = 1;
        dfs(0, 1, 0);

        return dp[t][target] == 0 ? 0 : (1.0 / dp[t][target]);
    }

    public void dfs(int t, int n, int fa) {
        if (t >= maxT)
            return;
        if (g[n].size() > 1) {
            for (int c : g[n]) {
                if (c != fa) {
                    dp[t + 1][c] = dp[t][n] * (g[n].size() - 1);
                    dfs(t + 1, c, n);
                }
            }
        } else {
            dp[t + 1][n] = dp[t][n];
            dfs(t + 1, n, n);
        }
    }
}
```


[1]:https://leetcode.cn/problems/diameter-of-binary-tree/description/ "543. 二叉树的直径(easy)"
[2]:https://leetcode.cn/problems/distribute-coins-in-binary-tree/description/ "979. 在二叉树中分配硬币(medium)"
[3]:https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/ "124. 二叉树中的最大路径和(hard)"
[4]:https://leetcode.cn/problems/longest-path-with-different-adjacent-characters "2246. 相邻字符不同的最长路径(hard)"
[5]:https://leetcode.cn/problems/house-robber-iii/ "337. 打家劫舍III(medium)"
[6]:https://leetcode.cn/problems/frog-position-after-t-seconds/description/ "1377. T 秒后青蛙的位置(hard)"