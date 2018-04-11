---
layout: booknote
permalink: /SQL_Basic_tutorial
---

>看这本书的目的是温故标准 SQL 基础知识。

### `p14` SQL 语句及其种类
* DDL:(Data Definition Language)
  * `CREATE`
  * `DROP`
  * `ALTER`
* DML:(Data Manipulation Language)
  * `SELECT`
  * `INSERT`
  * `UPDATE`
  * `DELETE`
* DCL:(Data Control Language)
  * `COMMIT`
  * `ROLLBACK`
  * `GRANT`
  * `REVOKE`

### `p15-p16` SQL 的基本书写规则
* SQL 语句要以分号结尾
* SQL 语句不区分关键字的大小写
* 常数书写方式固定:
  * 字符串用单引号括起来
  * 数字直接写，不使用任何标记符号
  * 日期格式有多种('26 Jan 2010'或者'10/01/26'或者'2010-01-06')
* 单词之间需要用半角空格或者换行符来分隔

### `p21` 命名规则
1. **只能使用半角英文字母、数字、下划线作为数据库、表和列的名称**。例如，不能讲列明 a_b 改为 a-b。标准 SQL 不支持连字符、$、#、？作为名称使用。
2. **名称只能以半角英文字母开头**
