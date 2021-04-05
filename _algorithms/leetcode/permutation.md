---
title: "全排列专项"
date: 2021-04-01 22:33:20
method_id: 全排列
tags:
    - 方法学习
---

## next_permutation (允许重复)
```rust
impl Solution {
    pub fn next_permutation(nums: &mut Vec<i32>) {
        // 从右向左找第一个升序对[i,i+1]
        if let Some(i) = nums[..nums.len() - 1].iter().enumerate().rposition(|(pos, _)| nums[pos] < nums[pos + 1]) {
            // 从右向左找第一个比 nums[i] 大的数 nums[x]
            if let Some(x) = nums[(i + 1)..].iter().rposition(|item| item > &nums[i]) {
                nums.swap(i, i + 1 + x);
            }
            &nums[i + 1..].reverse();
        } else {
            nums.reverse();
        }
    }
}
```

## 回溯法（不允许重复，不开新空间）
```rust
impl Solution {
    pub fn permute(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut result = vec![];
        Solution::permute0(&mut nums, 0, &mut result);
        return result
    }

    fn permute0<T:PartialEq + Clone>(arr: &mut Vec<T>, idx: usize, result: &mut Vec<Vec<T>>) {
        let len = arr.len();
        if idx == len {
            result.push(arr.clone());
            return;
        }
        for i in idx..len {
            arr.swap(i, idx);
            Solution::permute0(arr, idx + 1, result);
            arr.swap(i, idx);
        }
    }
}
```

## 回溯法（不允许重复，开新空间）
```rust
impl Solution {
    pub fn permute(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut vis: Vec<bool> = (0..nums.len()).map(|x| false).collect();
        let mut result = vec![];
        Solution::permutation_collector(&mut nums, 0, &mut vis, &mut vec![], &mut result);
        return result;
    }

    pub fn permutation_collector<T: PartialEq + Copy>(arr: &mut Vec<T>, idx: usize, vis: &mut Vec<bool>, collector: &mut Vec<T>, res: &mut Vec<Vec<T>>) {
        if collector.len() == arr.len() {
            res.push(collector.clone());
            return;
        }
        for i in 0..arr.len() { //  arr 中所有还没有参与排列的元素都可以 push 进 collector
            if vis[i] {
                continue;
            }
            collector.push(arr[i]);
            vis[i] = true;
            Solution::permutation_collector(arr, idx + 1, vis, collector, res);
            collector.pop();
            vis[i] = false;
        }
    }
}
```
## 回溯法（允许重复）
```rust
impl Solution {
    pub fn permute_unique(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut vis: Vec<bool> = (0..nums.len()).map(|x| false).collect();
        let mut result = vec![];
        nums.sort();
        Solution::permutation_dup(&mut nums, 0, &mut vis, &mut vec![], &mut result);
        return result;
    }

    fn permutation_dup<T: PartialEq + Copy>(arr: &mut Vec<T>, idx: usize, vis: &mut Vec<bool>, collector: &mut Vec<T>, res: &mut Vec<Vec<T>>) {
        if collector.len() == arr.len() {
            res.push(collector.clone());
            return;
        }
        for i in 0..arr.len() {
            if vis[i] || (i > 0 && arr[i] == arr[i - 1] && !vis[i - 1]) {
                continue;
            }
            vis[i] = true;
            collector.push(arr[i]);
            Solution::permutation_dup(arr, idx + 1, vis, collector, res);
            collector.pop();
            vis[i] = false;
        }
    }
}
```