---
title: "链表习题总结"
date: 2024-06-19 23:31:00
method_id: 链表
method: true
alg_tag: 总结
tags:
  - 方法学习
---

* toc
{:toc}


## 第一组

### 21.合并两个有序链表(easy)

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // 技巧：引入一个辅助头结点
        ListNode head = new ListNode();
        ListNode c = head;
        while (l1 != null && l2 != null) {
            if (l1.val >= l2.val) {
                c.next = l2;
                l2 = l2.next;
            } else {
                c.next = l1;
                l1 = l1.next;
            }
            c = c.next;
        }
        // 剩下的直接接上
        c.next = l1 != null ? l1 : l2;
        return head.next;
    }
}
```

### 141.环形链表(easy)

快慢指针判断链表是否有环

既可以开始的时候快慢指针都指向head

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode p = head, q = head;
        while (p != null && q != null) {
            p = p.next;
            q = q.next;
            if (q == null) break;
            q = q.next;
            if (p == q) return true;
        }
        return false;
    }
}
```

也可以开始的时候快指针指向 head.next

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) return false;
        ListNode p = head, q = head.next;
        while (q != null && q.next != null) {
            p = p.next;
            q = q.next.next;
            if (p == q) return true;
        }
        return false;
    }
}
```

注意，第二份代码更值得提倡，因为如果没有环，算法结束时，慢指针 p 指向了 mid，归并排序的时候可以直接使用这个 mid，让 mid.next = null 把链表分为两半

```text
nil               => p 指向 nil
1                 => p 指向 1
1->2              => p 指向 1
1->2->3           => p 指向 2
1->2->3->4        => p 指向 2
1->2->3->4->5     => p 指向 3
1->2->3->4->5->6  => p 指向 3
```

### 148.排序链表(medium)

链表的归并排序，直接组合 21 和 141 的函数即可

```java
class Solution {

    public ListNode mergeList(ListNode l1, ListNode l2) {
        ListNode head = new ListNode();
        ListNode c = head;
        while (l1 != null && l2 != null) {
            if (l1.val >= l2.val) {
                c.next = l2;
                l2 = l2.next;
            } else {
                c.next = l1;
                l1 = l1.next;
            }
            c = c.next;
        }
        c.next = l1 != null ? l1 : l2;
        return head.next;
    }

    public ListNode getRightList(ListNode head) {
        if (head == null) return null;
        ListNode p = head, q = head.next;
        while (q != null && q.next != null) {
            p = p.next;
            q = q.next.next;
        }
        // 此时 p 一定在中间
        ListNode tmp = p.next;
        // 从此处斩断
        p.next = null;
        return tmp;
    }

    public ListNode sortList(ListNode head) {
        // 这里很容易漏掉单元素链表要直接返回，否则会无限递归
        if (head == null || head.next == null) return head;
        ListNode left = head;
        ListNode right = getRightList(head);
        ListNode orderedLeft = sortList(left);
        ListNode orderedRight = sortList(right);
        return mergeList(orderedLeft, orderedRight);
    }
}
```

## 第二组

### 206.反转链表(easy)

日经题，双指针法，参见[之前的图解](/leetcode/206/#id-方法二)

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        // 注意，不需要对 head 进行额外的边界讨论，无脑开始双指针即可
        ListNode p = null;
        ListNode q = head; 
        // 双指针，p 一开始为 null， q 指向 head
        // 最终 q 为 null 时结束
        while (q != null) {
            ListNode tmp = q.next;
            q.next = p;
            p = q;
            q = tmp;
        }
        return p;
    }
}
```

### 92.反转链表II(medium)

需要依赖206，即便如此还是有点复杂，我不想复习了，[以前总结过](/leetcode/92/)


### 25.K个一组反转链表(hard)

本来这题依赖 92，而且[以前总结过](/leetcode/25/)，以前的方法也很复杂。

这次我用了一个新的方法，不需要很仔细的摆弄指针也能写出来，且击败100%：

每隔着k个元素把链表切断，头和尾搜集到一个 List，最后把 List 中相邻的的元素的尾和头接起来即可

```java
class Solution {
    // 标准的反转链表
    public ListNode reverseList(ListNode head) {
        ListNode p = null, q = head;
        while (q != null) {
            ListNode tmp = q.next;
            q.next = p;
            p = q;
            q = tmp;
        }
        return p;
    }

    public ListNode reverseKGroup(ListNode head, int k) {
        List<ListNode[]> arr = new ArrayList<>();
        // p 指向当前片段的头，q 指向当前片段的尾
        ListNode p = head, q = head;
        while (true) {
            int n = 1;
            while (n < k && q != null) { // 移动 k-1 次尾指针
                q = q.next;
                n++;
            }
            if (n == k && q != null) {
                ListNode tmp = q.next;
                q.next = null; // 切断
                reverseList(p); // 反转
                arr.add(new ListNode[]{q, p}); // 存储反转后的头和尾
                p = q = tmp; // 到新片段的开头
            } else { // 不足 k 个，或者尾指针为 null 了
                arr.add(new ListNode[]{p, null});
                break;
            }
        }
        // 连接所有片段
        for (int i = 1; i < arr.size(); i++) {
            arr.get(i-1)[1].next = arr.get(i)[0];
        }
        return arr.get(0)[0];
    }
}
```

## 第三组
### 146.LRU缓存

1. 实现一个双向链表，有 head 和 tail 辅助节点
2. 开一个 HashMap 存链表的节点
3. get 的时候把节点移到链表的表头 (_**moveToHead**_)
4. put 的时候
   * 如果是更新，则把节点移到链表头 (_**moveToHead**_)
   * 如果是插入，直接插到链表头 (_**addToHead**_)。如果容量爆了，删除一个链表尾部的元素 (_**deleteTail**_)

```java
(账号找回来了再补充代码)
 ```
