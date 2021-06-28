---
layout: post 
title: 减少无谓的事务创建 
tags:
    - database 
    - action
---

* toc
{:toc}

## 问题背景

今天要修复某业务列表加载缓慢的问题，业务逻辑的写法是在双重循环的最内层循环中有数据库查询，这块代码当初被写成这样，是因为业务本身就是这么复杂导致的，大多数场景不会遇到性能瓶颈，但当客户的业务量大到一定程度后，用户体验和服务的性能都会收到影响。
伪代码如下:

```javascript
for (let projectId of Object.keys(xxxMap)) {
    let projectItems = xxxMap[projectId];
    for (let item of projectItems) {
        let users = await getUsersByReceivers(item.receiverList, projectId); // 数据库 IO 操作
        if (check(users)) {
            // ...
        }
    }
}
```

双重循环的串行 IO 是非常耗时的操作，我们先不讨论其业务逻辑，对上面这段代码进行一定的变换，提前就并发地把内层循环需要使用到的数据查询好。

```javascript
for (let projectId of Object.keys(xxxMap)) {
    let projectItems = xxxMap[projectId];
    let usersList = await Promise.all(projectItems.map(async (item) => {
        return await getUsersByReceivers(item.receiverList, projectId);
    }));
    let usersListMap = _.zipObject(projectItems.map(c => c.id), usersList);
    for (let item of projectItems) {
        if (check(usersListMap[item.id])) {
            // ...
        }
    }
}
```

这样修改后，我本地使用测试账号对目标接口进行测试，耗时从 140ms 左右降低到了 50ms 左右，此时我认为已经满足了客户的需求。

提交代码后，同事在进行 code review 时提出，这样虽然提高了性能，但可能会对数据库产生更大的压力，并没有减少产生的 SQL 语句个数，应该从业务逻辑上另外想办法绕过，不要让 IO 规模跟 `projectItems` 的规模产生关系。

## 降低 IO 规模

上面的业务代码产生的数据库 IO，不仅跟项目个数有关，也跟每个项目下面的业务项的个数有关，重新梳理后，可以让 IO 次数只与项目个数有关，但测试后发现，性能衰减到了 70ms 左右。数了数发起的 SQL 数目，从之前的 14 个 SQL 减少到了 9 个 SQL。一顿操作后反而性能有所下降，这让我比较困惑。

查看 SQL 日志发现，有大量的事务创建和提交，怀疑是此带来的额外开销。
```log
[ayH2ah] [2021-06-28 19:49:11.49.272] beginTransaction
[ayH2ah] [2021-06-28 19:49:11.49.287]  select role.* from role where ( role.id in (2731, 2725) ) order 
[ayH2ah] [2021-06-28 19:49:11.49.290]  select xxx.* from xxx where ( xxx.id in (338) ) order by create_
[ayH2ah] [2021-06-28 19:49:11.49.291] commitTransaction
[oJLwYA] [2021-06-28 19:49:11.49.298]  select xxx.*, uprv.role_id as roleId from (select * from (select
[hLKZvf] [2021-06-28 19:49:11.49.301] beginTransaction
[hLKZvf] [2021-06-28 19:49:11.49.304]  select role.* from role where ( role.id in (1) ) order by create
[hLKZvf] [2021-06-28 19:49:11.49.306]  select xxx.* from xxx where ( xxx.id in (338) ) order by create_
[hLKZvf] [2021-06-28 19:49:11.49.307] commitTransaction
[69WZw4] [2021-06-28 19:49:11.49.314]  select xxx.*, uprv.role_id as roleId from (select * from (select
[nvwxW7] [2021-06-28 19:49:11.49.317] beginTransaction
[nvwxW7] [2021-06-28 19:49:11.49.320]  select xxx.* from xxx where ( xxx.id in (338) ) order by create_
[nvwxW7] [2021-06-28 19:49:11.49.321] commitTransaction
[vLUcHc] [2021-06-28 19:49:11.49.324] beginTransaction
[vLUcHc] [2021-06-28 19:49:11.49.327]  select xxx.* from xxx where ( xxx.id in (338) ) order by create_
[vLUcHc] [2021-06-28 19:49:11.49.328] commitTransaction
[dNKXAN] [2021-06-28 19:49:11.49.331] beginTransaction
[dNKXAN] [2021-06-28 19:49:11.49.334]  select xxx.* from xxx where ( xxx.id in (338) ) order by create_
[dNKXAN] [2021-06-28 19:49:11.49.335] commitTransaction
```
将这些业务放在同一个事务中之后，性能恢复正常，回到了 50ms，此时代码变成了
```javascript
for (let projectId of Object.keys(xxxMap)) {
    let projectItems = xxxMap[projectId];
    let usersListMap = await getUsersMapByReceivers(projectItems, projectId); // 该方法产生的 IO 数与 projectItems 规模无关
    for (let item of projectItems) {
        if (check(usersListMap[item.id])) {
            // ...
        }
    }
}
```
此时还可以使用一开始的并发 IO 的方式继续优化，彻底去掉 for 循环产生的串行 IO，性能来到 35ms，代码略。

碎片事务过多导致性能降低的一个原因似乎是，node-mysql 在创建事务和提交事务时，会向数据库提交独立的 SQL 语句:

```javascript
Connection.prototype.beginTransaction = function beginTransaction(options, callback) {
    // ...
    options = options || {};
    options.sql = 'START TRANSACTION';
    options.values = null;

    return this.query(options, callback);
};

Connection.prototype.commit = function commit(options, callback) {
    // ...
    options = options || {};
    options.sql = 'COMMIT';
    options.values = null;

    return this.query(options, callback);
};
```

## 小结
优化业务代码的性能，不仅可以从 SQL 本身出发去优化单个 SQL 的性能，也可以从业务逻辑上考虑。
具体地说，我们需要尽可能的避免在循环中去发起数据库查询，另外要注意不要产生过多的碎片事务。