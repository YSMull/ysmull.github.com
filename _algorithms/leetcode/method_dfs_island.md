---
title: "岛屿上的DFS总结"
date: 2024-06-15 22:38:00
method_id: 深度优先搜索
method: true
math: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}


### 200.岛屿数量(medium)

题目链接：[leetcode 200.岛屿数量](https://leetcode.cn/problems/number-of-islands)

```java
class Solution {

    public void fill(char[][] grid, int i, int j) {
        if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0) return;
        if (grid[i][j] != '1') return;
        grid[i][j] = '2';
        fill(grid, i, j + 1);
        fill(grid, i, j - 1);
        fill(grid, i + 1, j);
        fill(grid, i - 1, j);
    }

    public int numIslands(char[][] grid) {
        int res = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    res += 1;
                    fill(grid, i, j);
                }
            }
        }
        return res;
    }
}
```

### 463.岛屿的周长(easy)

题目链接: [leetcode 463.岛屿的周长](https://leetcode.cn/problems/island-perimeter/description/)

思路：某个 grid 为 0 的位置，考察其四周，如果是水或者是边界，则周长加 1

#### 方法一：遍历
```java
class Solution {

    public int isBorderOrWater(int[][] grid, int i, int j) {
        if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0)
            return 1;
        if (grid[i][j] == 0)
            return 1;
        return 0;
    }

    public int islandPerimeter(int[][] grid) {
        int res = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) {
                    res += (
                        isBorderOrWater(grid, i, j + 1) + 
                        isBorderOrWater(grid, i + 1, j) + 
                        isBorderOrWater(grid, i - 1, j) + 
                        isBorderOrWater(grid, i, j - 1)
                    );
                    
                }
            }
        }
        return res;
    }
}
```

#### 方法二：DFS

```java
class Solution {

    public int dfs(int[][] grid, int i, int j) {
        if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0)
            return 1;
        if (grid[i][j] == 0)
            return 1;
        if (grid[i][j] == 2)
            return 0;
        grid[i][j] = 2;
        return dfs(grid, i, j + 1) +
                dfs(grid, i, j - 1) +
                dfs(grid, i + 1, j) +
                dfs(grid, i - 1, j);
    }

    public int islandPerimeter(int[][] grid) {
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) {
                    return dfs(grid, i, j);
                }
            }
        }
        return 0;
    }
}
```

### 695.岛屿的最大面积(medium)

题目链接: [leetcode 695.岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island)

```java
class Solution {

    public int dfs(int[][] grid, int i, int j) {
        if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0)
            return 0;
        if (grid[i][j] != 1)
            return 0;
        grid[i][j] = 2;
        return 1 + dfs(grid, i, j + 1) +
                dfs(grid, i, j - 1) +
                dfs(grid, i + 1, j) +
                dfs(grid, i - 1, j);
    }

    public int maxAreaOfIsland(int[][] grid) {
        int max = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) {
                    max = Math.max(max, dfs(grid, i, j));
                }
            }
        }
        return max;
    }
}
```

### 827.最大人工岛(hard)

题目链接: [leetcode 827.最大人工岛](https://leetcode.cn/problems/making-a-large-island/)

对于每个为 1 的格子，第一次 dfs，记录其属于哪个岛屿，以及其面积，然后再遍历每个 grid 为 0 的位置，考察此处补 0 之后，形成的新岛屿的面积。
（新面积为1 + 四周不同 index 的岛屿的面积之和）

```java
class Solution {

    public int dfs(int[][] grid, int i, int j, int areaIndex) {
        if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0)
            return 0;
        // 要么是别人的岛屿，要么是自己已访问过
        if (grid[i][j] != 1)
            return 0;
            
        // trick，记录是第几个岛屿
        grid[i][j] = areaIndex + 2;
        return 1 + dfs(grid, i, j + 1, areaIndex) +
                dfs(grid, i, j - 1, areaIndex) +
                dfs(grid, i + 1, j, areaIndex) +
                dfs(grid, i - 1, j, areaIndex);
    }

    public int largestIsland(int[][] grid) {
        int areaIndex = 0;
        int[] areas = new int[grid.length * grid[0].length];
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 1) {
                    int area = dfs(grid, i, j, areaIndex);
                    areas[areaIndex] = area;
                    areaIndex++;
                }
            }
        }

        int max = areas[0];
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 0) {
                    Set<Integer> set = new HashSet<>();
                    if (i - 1 >= 0 && i - 1 < grid.length && grid[i-1][j] > 1) set.add(grid[i-1][j]);
                    if (i + 1 >= 0 && i + 1 < grid.length && grid[i+1][j] > 1) set.add(grid[i+1][j]);
                    if (j - 1 >= 0 && j - 1 < grid[0].length && grid[i][j-1] > 1) set.add(grid[i][j-1]);
                    if (j + 1 >= 0 && j + 1 < grid[0].length && grid[i][j+1] > 1) set.add(grid[i][j+1]);
                    int newArea = 1;
                    for (Integer index : set) {
                        newArea += areas[index - 2];
                    }
                    max = Math.max(max, newArea);
                }
            }
        }
        return max;
    }
}
```

### 1254.统计封闭岛屿的数目(medium)


题目链接: [leetcode 1254.统计封闭岛屿的数目](https://leetcode.cn/problems/number-of-closed-islands/description/)

#### 方法一：灌水法

第一次 dfs，先从边界处所有为 0 的位置，往连通的 0 处灌水，此时剩余的 0 一定都是被 1 包裹的
第二次 dfs，从内部剩余的每个为 0 的位置，通过灌水，统计有多少个不同的连通的 0 区域

```java
class Solution {

    public void fill(int[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length)
            return;
        if (grid[i][j] == 1)
            return;
        if (grid[i][j] == 0) {
            grid[i][j] = 1;
        }
        fill(grid, i + 1, j);
        fill(grid, i - 1, j);
        fill(grid, i, j + 1);
        fill(grid, i, j - 1);
    }

    public int closedIsland(int[][] grid) {
        int res = 0;

        // 先从四周灌水
        for (int i = 0; i < grid.length; i++) {
            if (grid[i][0] == 0) {
                fill(grid, i, 0);
            }
            if (grid[i][grid[0].length - 1] == 0) {
                fill(grid, i, grid[0].length - 1);
            }
        }

        for (int j = 0; j < grid[0].length; j++) {
            if (grid[0][j] == 0) {
                fill(grid, 0, j);
            }
            if (grid[grid.length - 1][j] == 0) {
                fill(grid, grid.length - 1, j);
            }
        }

        // 再从内部灌水
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 0) {
                    fill(grid, i, j);
                    res += 1;
                }
            }
        }
        return res;
    }
}
```

#### 方法二：判断是否可逃逸

对于每个 0，都判断其是否可以逃逸到边界，如果不可以，则认为其被 1 包围了

注意，我一开始在 dfs 里把内联了，导致总是 WA

```java
class Solution {

    public boolean escape(int[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return true;
        if (grid[i][j] == 1) return false;
        // 走过
        if (grid[i][j] == 2) return false;
        grid[i][j] = 2;
        
        // !!注意下面的代码不可以内联，否则会因为逻辑运算符截断少遍历一些位置
        boolean a = escape(grid, i + 1, j);
        boolean b = escape(grid, i - 1, j);
        boolean c = escape(grid, i, j + 1);
        boolean d = escape(grid, i, j - 1);
        return a || b || c || d;
    }

    public int closedIsland(int[][] grid) {
        int res = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 0) {
                    if (!escape(grid, i, j)) {
                        res += 1;
                    }
                }
            }
        }
        return res;
    }
}
```


 
## 参考资料

[1]: https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/ "岛屿类问题的通用解法、DFS 遍历框架"
