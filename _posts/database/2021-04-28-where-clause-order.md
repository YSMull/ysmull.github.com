---
layout: post
title: where 条件顺序一变，delete 就报错？
tags:
    - database
    - action
---

* toc
{:toc}

## 问题背景
上班上得好好的，突然同事跟我说，在开发环境，有数无法创建自定义 SQL 了。根据日志定位到代码，发现相关代码很久没有改动过了，但是线上没有问题。报错的是这样一段 SQL：
```sql
delete
from global_parameter_ref
where global_parameter_ref.resource_id = 5471
  and global_parameter_ref.resource_type = 'CUSTOM_TABLE';
```
执行上面这段 SQL，会报如下错误：
```text
[22001][1292] Data truncation: Truncated incorrect DOUBLE value: 'c-1-132062-142229-kk6nz0ok'
```

因为 resource_id 的类型是 VARCHAR，报错信息说这里有一个 CAST 失败了，所以怀疑是不是使用了严格模式，遂写了如下查询 SQL 进行执行：

```sql
select *
from global_parameter_ref
where global_parameter_ref.resource_id = 5471
  and global_parameter_ref.resource_type = 'CUSTOM_TABLE';
```

把 delete 改成 select * 之后，执行起来没有任何问题。同事说，最近我们的 ORM 框架有一个[改动][1]，会影响生成的 where 条件的顺序。 改动前生成的 SQL 如下，可以正常执行：
```sql
delete
from global_parameter_ref
where global_parameter_ref.resource_type = 'CUSTOM_TABLE'
  and global_parameter_ref.resource_id = 5471;
```

那么问题就来了，为什么同样的一个操作，where 条件的顺序不一样，可以导致一条 SQL 报错，另一条 SQL 不报错呢？

这里我们猜测，是因为筛选顺序不一致导致的。因为 resource_type = 'CUSTOM_TABLE' 的记录的 resource_id 的确是可以安全的 CAST 到数字的。如果 MySQL 先用 resource_type 进行筛选，就不会发生运行时类型转换错误。而如果先用 resource_id 进行筛选，某些记录的 resource_id 无法转换成数字，就会报错。

这里有两个问题：
1. 为什么 SELECT 的时候不会报这个 CAST 错误？
2. WHERE 条件的顺序一定是从左往右执行的吗？

## delete 和 select 的不同
通过试验发现， 对于一个 where 从句 where t.a = b，其中t.a 是表 t 的字段，b是字面量，如果字段类型和字面量类型不同，那么：
1. 在 delete 时，MySQL 会尝试把 a CAST 到 b 的类型
2. 在 select 时，MySQL 会尝试把 b CAST 到 a 的类型

之所以这样做，一个比较合理的解释是：**删除的时候，以字面量的类型为准，可以防止误删；查询时以字段类型为准，防止漏查**。

## where 条件顺序的影响
我认为程序员在写 SQL 的时候，不应该去关心 where 条件的顺序，因为这个顺序不影响 SQL 的语义，具体数据库按怎样的顺序来执行这段 SQL，取决于数据库的实现或优化策略。

如果两个筛选条件出现的顺序极大的影响了 SQL 的执行性能，那么你应该考虑的是，是不是应该给其中一个条件使用到的字段加索引，或者明确的强制这段 SQL 走这个索引。

在我们上面的这个案例当中，where 从句的两个条件使用的字段都没有加索引，所以 MySQL 选择了 **从左往右** 的顺序来进行筛选，因此导致了 SQL 执行报错，这也是为什么当我们交换 where 条件的顺序后，就不报错了。

当我们在 where 子句中增加一个主键筛选后，MySQL 就不会无脑的从左往右执行，而是走了主键索引，此时同样不会报错了：
```sql
delete
from global_parameter_ref
where global_parameter_ref.resource_id = 5471
  and global_parameter_ref.resource_type = 'CUSTOM_TABLE'
  and id = 6; -- id 等于 6 的这条记录的 resource_id 是一个数字字符串，所以不会报错
```

那么，如果我们给 resource_id 或者 custom_type 加一个索引，让 delete 语句强制走索引，这样不论 where 条件的顺序如何，这条 SQL 都不会报错。但可惜 MySQL 的 force index 语法并不支持 delete 语句。

## 修复
在执行删除操作时，不要让数据库做隐式类型转换，在应用层生成 SQL 时处理。
```sql
delete
from global_parameter_ref
where global_parameter_ref.resource_id = '5471' -- <--明确类型
  and global_parameter_ref.resource_type = 'CUSTOM_TABLE';
```





[1]: https://github.com/ZhangDianPeng/dborm-mysql/pull/7/commits/d512513b5f197ff2811ad3e933073e0392fc64a4