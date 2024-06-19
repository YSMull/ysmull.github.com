---
title: "一类滑动窗口的总结"
date: 2024-06-11 06:01:00
method_id: 滑动窗口
method: true
math: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}

## 引子

笔者以这篇文章[[1]][1]的介绍为引子，通过刷题总结，对其模板进行更加细分的总结

最基本的滑动窗口思路是这样的

```c++
// c++
void slidingWindow(String s) {
    int left = 0, right = 0;
    while (right < s.size()) {
        // 增大窗口
        window.add(s[right]);
        right++;
        while (window needs shrink) { // 这里什么时候是 while 什么时候是 if，条件如何写，下文讲
            // 缩小窗口
            window.remove(s[left]);
            left++;
        }
    }
}
```

注意，上面的模板中，当窗口需要缩小时，此时 right 指针已经在窗口外了，所以窗口长度可以用 $\mathrm{right - left}$ 表示，在 Java 中，子串可以用 s.substring(left, right) 表示

## 固定长度的窗口
### 模板

如果需要寻找的满足性质的子串的长度是固定的，则缩小窗口的条件是

$$\mathrm{if(right - left == len)}$$

此时进入 if 时，就可以校验该窗口所包裹的字符串是否是满足答案要求了。

```java
void slidingWindow(String s) {
    int left = 0, right = 0;
    while (right < s.size()) {
        // 增大窗口
        Character c = s.charAt(right++);
        window.put(c, window.getOrDefault(c, 0) + 1);
        // 当窗口长度达标时需要缩小窗口
        if (right - left == len) {
            // 判断是否需要收集或更新答案
            ...
            Character d = s.charAt(left++);
            window.put(d, window.getOrDefault(d, 0) - 1);
        }
    }
}
```

### 30.串联所有单词的子串(hard)

题目链接：[leetcode 30.串联所有单词的子串](https://leetcode.cn/problems/substring-with-concatenation-of-all-words/description/)

#### 窗口每次滑动一个字符

每次固定窗口后，判断窗口是否符合性质，isValid 的复杂度比较高

```java
class Solution {

    public boolean isValid(String s, int left, int right, int batchSize, HashMap<String, Integer> need) {
        HashMap<String, Integer> cur = new HashMap<>();
        for (int i = left; i < right; i += batchSize) {
            String part = s.substring(i, i + batchSize);
            cur.put(part, cur.getOrDefault(part, 0) + 1);
        }
        if (need.size() == cur.size()) {
            for (Map.Entry<String, Integer> entry : need.entrySet()) {
                String needKey = entry.getKey();
                Integer needValue = entry.getValue();
                if (!needValue.equals(cur.get(needKey))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public List<Integer> findSubstring(String s, String[] words) {
        int left = 0, right = 0;
        int partLen = words[0].length();
        int len = words.length * partLen;

        HashMap<String, Integer> need = new HashMap<>();
        for (int i = 0; i < words.length; i++) {
            need.put(words[i], need.getOrDefault(words[i], 0) + 1);
        }

        List<Integer> res = new ArrayList<>();
        while (right < s.length()) {
            Character c = s.charAt(right++);
            if (right - left == len) {
                if (isValid(s, left, right, partLen, need)) {
                    res.add(left);
                }
                Character d = s.charAt(left++);
            }
        }
        return res;
    }
}
```

#### 窗口每次滑动一个单词

单词长度为 k，窗口大小是 k 的倍数，遍历起始滑动位置[0, k)，所以复杂度是 O(k*n)

```java
class Solution {

    public boolean isValid(HashMap<String, Integer> window, HashMap<String, Integer> need) {
        for (Map.Entry<String, Integer> entry : need.entrySet()) {
            String needKey = entry.getKey();
            Integer needValue = entry.getValue();
            if (!needValue.equals(window.get(needKey))) {
                return false;
            }
        }
        return true;
    }

    public List<Integer> findSubstring(String s, int batchLen, int len, int start, HashMap<String, Integer> need) {
        int left = start, right = start;
        List<Integer> res = new ArrayList<>();
        HashMap<String, Integer> window = new HashMap<>();
        
        // 这里注意下
        while (right + batchLen <= s.length()) {
            String c = s.substring(right, right + batchLen);
            right += batchLen;
            if (need.get(c) != null) {
                window.put(c, window.getOrDefault(c, 0) + 1);
            }
            if (right - left == len) {
                if (isValid(window, need)) {
                    res.add(left);
                }
                String d = s.substring(left, left + batchLen);
                left += batchLen;
                if (need.get(d) != null) {
                    window.put(d, window.getOrDefault(d, 0) - 1);
                }
            }
        }
        return res;
    }

    public List<Integer> findSubstring(String s, String[] words) {
        int partLen = words[0].length();
        int len = words.length * partLen;

        HashMap<String, Integer> need = new HashMap<>();
        for (String word : words) {
            need.put(word, need.getOrDefault(word, 0) + 1);
        }

        List<Integer> res = new ArrayList<>();
        
        // 这里注意下，start 不需要超过单词长度
        for (int start = 0; start < partLen; start++) {
            res.addAll(findSubstring(s, partLen, len, start,  need));
        }
        return res;
    }
}
```

### 187.重复的DNA序列(medium)

题目链接: [leetcode 187.重复的DNA序列](https://leetcode.cn/problems/repeated-dna-sequences/)

```java
class Solution {
    public List<String> findRepeatedDnaSequences(String s) {
        int left = 0, right = 0;
        Map<String, Integer> map = new HashMap<>();
        List<String> res = new ArrayList<>();
        while (right < s.length()) {
            right++;
            if (right - left == 10) {
                String sub = s.substring(left, right);
                map.put(sub, map.getOrDefault(sub, 0) + 1);
                left++;
            }
        }
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (entry.getValue() > 1) {
                res.add(entry.getKey());
            }
        }
        return res;
    }
}
```

### 239.滑动窗口最大值(hard，超时)
```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int left = 0, right = 0;
        int max = 0;
        int[] res = new int[nums.length - k + 1];
        PriorityQueue<Integer> q = new PriorityQueue<>((a, b) -> b - a);
        while (right < nums.length) {
            int c = nums[right++];
            q.offer(c);
            if (right - left == k) {
                res[left] = q.peek();
                int d = nums[left++];
                q.remove(d);
            }
        }
        return res;
    }
}
```

### 438.找到所有字母异位词(medium)

题目链接: [leetcode 438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        HashMap<Character, Integer> window = new HashMap<>();
        HashMap<Character, Integer> need = new HashMap<>();
        for (Character c : p.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        int left = 0, right = 0;
        int valid = 0;
        List<Integer> res = new ArrayList<>();
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (window.get(c).equals(need.get(c)))
                valid++;
            if (right - left == p.length()) {
                if (valid == need.size()) {
                    res.add(left);
                }
                Character d = s.charAt(left++);
                if (window.get(d).equals(need.get(d)))
                    valid--;
                window.put(d, window.get(d) - 1);
            }
        }
        return res;
    }
}
```

### 567.字符串的排列(medium)

题目链接: [leetcode 567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/description/)

```java
class Solution {
    public boolean checkInclusion(String p, String s) {
        HashMap<Character, Integer> window = new HashMap<>();
        HashMap<Character, Integer> need = new HashMap<>();
        for (Character c : p.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        int left = 0, right = 0;
        int valid = 0;
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (window.get(c).equals(need.get(c)))
                valid++;
            if (right - left == p.length()) {
                if (valid == need.size()) {
                    return true;
                }
                Character d = s.charAt(left++);
                if (window.get(d).equals(need.get(d)))
                    valid--;
                window.put(d, window.get(d) - 1);
            }
        }
        return false;
    }
}
```

### 658.找到 K 个最接近的元素(medium)

题目链接：[leetcode 658.找到 K 个最接近的元素](https://leetcode.cn/problems/find-k-closest-elements/description)

```java
class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int left = 0, right = 0;
        int cur = 0;
        // 记录每个窗口的绝对值的和
        List<Integer> acc = new ArrayList<>();
        while (right < arr.length) {
            int c = arr[right++];
            cur += Math.abs(c - x);
            if (right - left == k) {
                acc.add(cur);
                int d = arr[left++];
                cur -= Math.abs(d - x);
            }
        }

        // 寻找第一个最小绝对值的下标
        int minValue = Integer.MAX_VALUE;
        for (int i = 0; i < acc.size(); i++) {
            minValue = Math.min(minValue, acc.get(i));
        }
        int finalLeft = -1;
        for (int i = 0; i < acc.size(); i++) {
            if (acc.get(i) == minValue) {
                finalLeft = i;
                break;
            }
        }

        List<Integer> res = new ArrayList<>();
        for (int i = finalLeft; i < finalLeft + k; i++) {
            res.add(arr[i]);
        }
        return res;
    }
}
```

### 1297.子串的最大出现次数(medium)

题目链接：[leetcode 1297.子串的最大出现次数](https://leetcode.cn/problems/maximum-number-of-occurrences-of-a-substring/description)

```java
class Solution {

    public int maxFreq(String s, int maxLetters, int len) {
        int left = 0, right = 0;
        // 记录某个子串出现了多少次
        Map<String, Integer> countMap = new HashMap<>();
        // 为了维护区间内的不同的字符数
        Map<Character, Integer> window = new HashMap<>();
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            while (right - left == len) {
                String cur = s.substring(left, right);
                if (window.size() <= maxLetters) {
                    countMap.put(cur, countMap.getOrDefault(cur, 0) + 1);
                }
                Character d = s.charAt(left++);
                window.put(d, window.getOrDefault(d, 0) - 1);
                if (window.get(d) == 0) {
                    window.remove(d);
                }
            }
        }
        
        // 这个遍历map求max可以在每次更新 countMap 的时候维护
        int max = 0;
        for (Map.Entry<String, Integer> entry: countMap.entrySet()) {
            max = Math.max(entry.getValue(), max);
        }
        return max;
    }

    public int maxFreq(String s, int maxLetters, int minSize, int maxSize) {
        int max = 0;
        // 固定长度，遍历子串长度
        // 用反证法可以证明，如果满足条件的这个字符串出现次数最多，一定存在一个长度为 minSize 子串，也出现了这么多次，所以这里不用遍历到 maxSize
        for (int i = minSize; i <= maxSize; i++) {
            max = Math.max(maxFreq(s, maxLetters, i), max);
        }
        return max;
    }

}
```
## 非固定长度窗口

此时不能用窗口大小来作为缩小窗口的触发条件了，而是，当要最根据性质是否满足来触发窗口缩小

### 性质满足时缩小窗口
初始窗口不满足，增大窗口过程中可能突然满足（**或超出**）条件要求了
#### 模板
```java
void slidingWindow(String s) {
    int left = 0, right = 0;
    while (right < s.size()) {
        Character c = s.charAt(right++);
        window.put(c, window.getOrDefault(c, 0) + 1);
        while (性质满足时) {
            // 窗口缩小前性质满足了，收集结果
            ...
            Character d = s.charAt(left++);
            window.put(d, window.getOrDefault(d, 0) - 1);
        }
    }
}
```

#### 76.最小覆盖子串(hard)

题目链接: [76.最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)
```java
class Solution {
    public String minWindow(String s, String p) {
        HashMap<Character, Integer> window = new HashMap<>();
        HashMap<Character, Integer> need = new HashMap<>();
        for (Character c : p.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }

        int left = 0, right = 0;
        int valid = 0;

        int minLen = s.length();
        String minStr = "";
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (window.get(c).equals(need.get(c)))
                valid++;

            // 性质满足时
            while (valid == need.size()) {
                if (right - left <= minLen) {
                    minStr = s.substring(left, right);
                    minLen = right - left;
                }
                Character d = s.charAt(left++);
                if (window.get(d).equals(need.get(d)))
                    valid--;
                window.put(d, window.get(d) - 1);
            }
        }
        return minStr;
    }
}
```

#### 209.长度最小的子数组(medium)

题目链接: [长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/description/)

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int total = 0;
        for (int i = 0; i < nums.length; i++) {
            total += nums[i];
        }
        if (total < target) return 0;
        
        int left = 0, right = 0;
        int sum = 0;
        int minLen = nums.length;
        while (right < nums.length) {
            int c = nums[right++];
            sum += c;
            // 性质满足时
            while (sum >= target) {
                if (right - left <= minLen) {
                    minLen = right - left;
                }
                int d = nums[left++];
                sum -= d; 
            }
        }
        return minLen;
    }
}
```

### 性质被破坏时缩小窗口

如果不需要收缩窗口，且性质时满足的，就不断的更新当前 left 下的答案

随着窗口的变大，性质可能不满足了，此时需要缩小窗口让再次满足性质

#### 模板
```java
void slidingWindow(String s) {
    int left = 0, right = 0;
    while (right < s.size()) {
        Character c = s.charAt(right++);
        window.put(c, window.getOrDefault(c, 0) + 1);
        // update，713 题告诉我们，根据题目要求的性质，是无法保证 left 小于 right 的
        while (left < right && 性质被破坏时) {
            Character d = s.charAt(left++);
            window.put(d, window.getOrDefault(d, 0) - 1);
        }
        // 窗口缩小后性质又满足了，此处收集结果
        ...
    }
}
```
#### 3.无重复字符串的最长子串(medium)

题目链接: [leetcode 3. 无重复字符串的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> window = new HashMap<>();
        int left = 0, right = 0;
        int maxLen = 0;
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            while (window.get(c) > 1) {
                Character d = s.charAt(left++);
                window.put(d, window.getOrDefault(d, 0) - 1);
            }
            maxLen = Math.max(right - left, maxLen);
        }
        return maxLen;
    }
}
```

#### 395.最少K个重复字符的最长子串(medium)

题目链接: [leetcode 395.最少K个重复字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/description)

##### 固定长度窗口解法(超时)
这道题，有两种做法，遍历最长子串的长度，1~s.length()，原题转化为**固定长度的滑动窗口问题**，复杂度较高，会超时
```java
class Solution {

    public boolean isValidWindow(HashMap<Character, Integer> window, int k) {
        boolean isValid = true;
        for (Map.Entry<Character, Integer> entry: window.entrySet()) {
            if (entry.getValue() > 0 && entry.getValue() < k) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    public boolean longestSubstring(String s, int k, int len) {
        HashMap<Character, Integer> window = new HashMap<>();
        int maxLen = 0;
        int left = 0, right = 0;
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (right - left >= len) {
                if (isValidWindow(window, k)) {
                    return true;
                }
                Character d = s.charAt(left++);
                window.put(d , window.get(d) - 1);
            }
        }
        return false;
    }

    public int longestSubstring(String s, int k) {
        // 复杂度较高，为了稳定过题，得把 s.length() 改成 1000（逃
        for (int i = s.length(); i >= 1; i--) {
            if (longestSubstring(s, k, i)) {
                return i;
            }
        }
        return 0;
    }

}
```

##### 不固定长度窗口解法
由于字符串只包含26个字母，因此可以考虑遍历字符串包含了多少个不同的字符，转化为**不定长滑动窗口问题**

```java
class Solution {

    public boolean isValidWindow(HashMap<Character, Integer> window, int k, int alphaNum) {
        if (window.size() != alphaNum)
            return false;
        boolean isValid = true;
        for (Map.Entry<Character, Integer> entry : window.entrySet()) {
            if (entry.getValue() < k) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    public int longestSubstring(String s, int k, int alphaNum) {
        HashMap<Character, Integer> window = new HashMap<>();
        int left = 0, right = 0;
        int max = 0;
        while (right < s.length()) {
            Character c = s.charAt(right++);
            window.put(c, window.getOrDefault(c, 0) + 1);
            
            // 字符数一开始不够，增大的过程中会字符种类数会爆掉
            while (window.size() > alphaNum) {
                Character d = s.charAt(left++);
                window.put(d, window.get(d) - 1);
                if (window.get(d) == 0) {
                    window.remove(d);
                }
            }
            
            // 此时满足性质，不断更新最大值
            if (isValidWindow(window, k, alphaNum)) {
                max = Math.max(max, right - left);
            }
        }
        return max;
    }

    public int longestSubstring(String s, int k) {
        int max = 0;
        for (int i = 26; i >= 1; i--) {
            max = Math.max(longestSubstring(s, k, i), max);
        }
        return max;
    }

}
```

#### 713.乘积小于 K 的子数组(medium)

题目链接：[leetcode 713.乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/)

这题比较隐晦的点在于，需要让统计值加上当前窗口的长度

假设 a\*b\*c\*d<k 且 此时 right++ 把 e 也纳入进来后 a\*b\*c\*d\*e<k，则新增5个答案("abcde"的length)

```text
原本        新增
a,b,c,d     e
ab,bc,cd    de
abc,bcd     cde
abce        bcde
            abcde
```

假设 a\*b\*c\*d<k 但是 a\*b\*c\*d\*e>=k 了，此时 left++ 假设去掉了 a,b,c 之后, d * e 满足乘积小于 k 了，此时新增2个答案（"de"的length)

```text
原本        新增
a,b,c,d     e
ab,bc,cd    de
abc,bcd
abcd
```

```java
class Solution {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        int count = 0;
        int prod = 1;
        int left = 0, right = 0;
        while (right < nums.length) {
            int c = nums[right++];
            prod *= c;
            // 注意这里需要额外加 left < right
            while (left < right && prod >= k) {
                int d = nums[left++];
                prod /= d;
            }
            count += right - left;
        }
        return count;
    }
}
```

#### 1004.最大连续1的个数III(medium)

题目链接：[leetcode 1004.最大连续1的个数III](https://leetcode.cn/problems/max-consecutive-ones-iii)

##### 固定长度窗口解法(超时)
```java
class Solution {

    public boolean longestOnes(int[] nums, int k, int len) {
        int left = 0, right = 0;
        int zeros = 0;
        while (right < nums.length) {
            int c = nums[right++];
            if (c == 0) {
                zeros++;
            }
            if (right - left == len) {
                if (zeros <= k) {
                    return true;
                }
                int d = nums[left++];
                if (d == 0) {
                    zeros--;
                }
            }
        }
        return false;
    }

    public int longestOnes(int[] nums, int k) {
        for (int len = nums.length; len >= 1; len--) {
            if (longestOnes(nums, k, len)) {
                return len;
            }
        }
        return 0;
    }
}
```

##### 不固定长度窗口解法
```java
class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0, right = 0;
        int zeros = 0;
        int maxLen = 0;
        while (right < nums.length) {
            int c = nums[right++];
            if (c == 0) {
                zeros++;
            }
            while (left < right && zeros > k) {
                int d = nums[left++];
                if (d == 0) {
                    zeros--;
                }
            }
            maxLen = Math.max(maxLen, right - left);
        }
        return maxLen;
    }
}
```
## 其它注意点

### 对称性
增大窗口和缩小窗口时，不论是更新 window 还是 valid，其代码是符合对称性的
```java
// 增大窗口
window.put(c, window.getOrDefault(c, 0) + 1);
if (window.get(c).equals(need.get(c)))
    valid++;

// 缩小窗口
if (window.get(d).equals(need.get(d)))
    valid--;
window.put(d, window.get(d) - 1);
```

### window 可以更节约内存占用

上文中所有的算法解答，window 描述的都是 left 和 right 包裹的子串的字符频数信息，如果为了节约内存，可以仅在 window 中保留关注的字符的频数信息
比如上文中，凡是有 need 这个 map 的解答
1. 窗口增大时，if (need.get(c) != null) 再更新 window 和 valid
2. 窗口缩小时，if (need.get(d) != null) 再更新 window 和 valid

否则，在更新 valid 的判断时，if (window.get(c).equals(need.get(c)))，window 必须在左边，因为 c 不是一个被关注的字符，所以 need.get(c) 可能为 null

### 选择哪种非固定长度的滑动窗口？
根据上面的总结 
* 求长度最小的子串时，满足性质时收缩，收缩前收集答案求长度最长的子串时
* 求长度最大的子串时，性质不满足时收缩，收缩后判断是否满足性质，收集答案。（根据395，这里的两个判断可以不一样）

注意：有的使用非固定长度的滑动窗口模板，在收缩条件处可以加一句 $left < right$ 防御一手
 
## 参考资料

[1]: https://leetcode.cn/problems/find-all-anagrams-in-a-string/solutions/9749/hua-dong-chuang-kou-tong-yong-si-xiang-jie-jue-zi-/ "我写了一首诗，把滑动窗口算法变成了默写题"
