---
title: Oracle
icon: page
order: 6
author: curryzhang
date: 2022-09-22
category:
  - Oracle
  - SQL
tag:
  - Oracle
  - SQL
# 是否置顶
# sticky: true
# 是否收藏
star: true
---

## 创建序列
```
create sequence SEQ_TEST
minvalue 0
maxvalue 999999999
start with 1
increment by 1
cache 10;
```
#### 创建存储过程，清空序列
```
create or replace procedure SEQ_RESET(v_seqname varchar2) as n number(20);
tsql varchar2(100);
begin
execute immediate 'select '||v_seqname||'.nextval from dual' into n;
n:=-(n);
tsql:='alter sequence '||v_seqname||' increment by '|| n;
execute immediate tsql;
execute immediate 'select '||v_seqname||'.nextval from dual' into n;
tsql:='alter sequence '||v_seqname||' increment by 1';
execute immediate tsql;
end SEQ_RESET;
```
#### 创建JOB定时执行存储过程
```
DECLARE JOB NUMBER;
BEGIN
    SYS.DBMS_JOB.SUBMIT ( 
        JOB => JOB, 
        WHAT => 'SEQ_TEST_RESET(''SEQ_TEST'');', 
        NEXT_DATE => TO_DATE('2022-09-09 00:00:00', 'yyyy-mm-dd hh24:mi:ss'), 
        INTERVAL => 'TRUNC(SYSDATE+1)'
    );
    COMMIT;
END;

```

## Oracle创建Job
```
DECLARE JOB NUMBER;
BEGIN
    SYS.DBMS_JOB.SUBMIT ( 
        JOB => JOB, 
        WHAT => 'WMS.SP_WMS_INV_BAK;', 
        NEXT_DATE => SYSDATE, 
        INTERVAL => 'TRUNC(SYSDATE+1)'
    );
    COMMIT;
END;
```

查询job，正常oracle都会存在两个表
```
SELECT * FROM dba_jobs;
SELECT * FROM user_jobs;
SELECT * FROM dba_jobs_running
```

删除job
```
BEGIN
  DBMS_JOB.REMOVE(4);  
  COMMIT;
END;
```

运行job
```
BEGIN
    DBMS_JOB.RUN(4);
END;
```

修改Job
```
BEGIN
   DBMS_JOB.NEXT_DATE(4,SYSDATE); 
   COMMIT;
END;
```

停止运行job
```
BEGIN
    DBMS_JOB.BROKEN (4, TRUE, NEXT_DATE) ; 
COMMIT ;
END ;
```

**表dba_jobs各字段解释**

字段（列）             | 数据类型           |字段描述 
---|---|---
JOB                    |NUMBER              |任务的唯一标示号 
LOG_USER               |VARCHAR2(30)        |提交任务的用户 
PRIV_USER              |VARCHAR2(30)        |赋予任务权限的用户 
SCHEMA_USER            |VARCHAR2(30)        |对任务作语法分析的用户模式 
LAST_DATE              |DATE                |最后一次成功运行任务的时间 
LAST_SEC               |VARCHAR2(8)         |如HH24:MM:SS格式的last_date日期的小时，分钟和秒 
THIS_DATE              |DATE                |正在运行任务的开始时间，如果没有运行任务则为null 
THIS_SEC               |VARCHAR2(8)         |如HH24:MM:SS格式的this_date日期的小时，分钟和秒 
NEXT_DATE              |DATE                |下一次定时运行任务的时间 
NEXT_SEC               |VARCHAR2(8)         |如HH24:MM:SS格式的next_date日期的小时，分钟和秒 
TOTAL_TIME             |NUMBER              |该任务运行所需要的总时间，单位为秒 
BROKEN                 |VARCHAR2(1)         |标志参数，Y标示任务中断，以后不会运行 
INTERVAL               |VARCHAR2(200)       |用于计算下一运行时间的表达式 
FAILURES               |NUMBER              |任务运行连续没有成功的次数 
WHAT                   |VARCHAR2(2000)      |执行任务的PL/SQL块 
CURRENT_SESSION_LABEL  |RAW MLSLABEL        |该任务的信任Oracle会话符 
CLEARANCE_HI           |RAW MLSLABEL        |该任务可信任的Oracle最大间隙 
CLEARANCE_LO           |RAW MLSLABEL        |该任务可信任的Oracle最小间隙 
NLS_ENV                |VARCHAR2(2000)      |任务运行的NLS会话设置 
MISC_ENV               |RAW(32)             |任务运行的其他一些会话参数

## 导出AWR分析数据库
1. 输入sqlplus
2. 输入用户名、密码
3. @?/rdbms/admin/awrrpt.sql
4. 输入report_type值：html或者text二选一
5. 输入num_days的值：这里输入的是返回几天的快照，这里输入5天，表示返回5天的记录
6. 输入snapid的起始值和结束值
7. 输入报告名
8. 日志默认保存在【C:\Users\用户名】下面

## 表创建更新
创建表: ORDER_BAS
``` 
CREATE TABLE ORDER_BAS (
    GUID VARCHAR2(50) NOT NULL,
    CREATE_BY VARCHAR2(20) NOT NULL,
    CREATE_TIME TIMESTAMP(0) NOT NULL,	
    ACTIVE_FLAG	VARCHAR2(1) NOT NULL,
    SKU	VARCHAR2(20) NOT NULL,
    SKU_CODE	VARCHAR2(20) NOT NULL,
    SKU_QTY NUMBER(18) NOT NULL,
    PRIMARY KEY(GUID)
);
-- 添加注释
comment on table ORDER_BAS is '订单表';
comment on column ORDER_BAS.SKU	is '商品名称';
comment on column ORDER_BAS.SKU_CODE is '商品编码';
comment on column ORDER_BAS.SKU_QTY	is '商品数量';
```
添加字段
```
--alter table  表名  add (字段  字段类型)  [ default  '输入默认值']  [null/not null]  ;

ALTER TABLE MY_WORKFLOW ADD 
(
    STATE VARCHAR2(2) DEFAULT '0' NOT NULL,
    NAME VARCHAR2(100)  NOT NULL,
    AGE NUMBER DEFAULT 0 NOT NULL
);
```
修改字段类型
```
alter table 表名  modiy (字段  字段类型  [default '输入默认值' ] [null/not null]  ,字段  字段类型  [default '输入默认值' ] [null/not null] ); 
```
修改多个字段用逗号隔开


删除字段
```
alter table  表名  drop (字段);
```

## CRUD

批量插入数据
```
INSERT ALL 
INTO TB_LOCATION ( GUID, ACTIVE_FLAG, CUSTOMER_ID, CREATE_BY, CREATE_TIME, LOC_ID, LOC_DESC ) VALUES ( sys_guid(), 'Y', '1000', '10001', SYSDATE, '3000', '国内仓' )
INTO TB_LOCATION ( GUID, ACTIVE_FLAG, CUSTOMER_ID, CREATE_BY, CREATE_TIME, LOC_ID, LOC_DESC ) VALUES ( sys_guid(), 'Y', '1000', '10001', SYSDATE, '3001', '国内成品仓' )
SELECT 1 FROM dual;
```

分页查询
```
SELECT * 
FROM
(
	SELECT ROWNUM AS rowno,t.* 
	FROM TB t 
	WHERE CREATE_TIME BETWEEN TO_DATE( '20220501', 'yyyymmdd' ) 
				AND TO_DATE( '20220531', 'yyyymmdd' ) 
				AND ROWNUM <= 20 
) t1 
WHERE t1.rowno >= 10

--直接复用
public static string ConCatSql(string sql, int rows, int page)
{
    StringBuilder Sql = new StringBuilder();
    Sql.Append(@"SELECT * FROM (SELECT A.*, ROWNUM RN from(");
    Sql.Append(sql);
    Sql.Append(@") A WHERE ROWNUM <= " + (rows * page) + ") WHERE RN>" + ((page - 1) < 0 ? 0 : (page - 1) * rows));
    return Sql.ToString();
}
```

## 各种系统表
```
select * from all_tab_comments -- 查询所有用户的表,视图等

select * from user_tab_comments -- 查询本用户的表,视图等

select * from all_col_comments  --查询所有用户的表的列名和注释.

select * from user_col_comments -- 查询本用户的表的列名和注释

select * from all_tab_columns --查询所有用户的表的列名等信息(详细但是没有备注).

select * from user_tab_columns --查询本用户的表的列名等信息(详细但是没有备注).

select table_name from all_tables --查询所有用户的表

select table_name from dbs_tables --包括系统表
```

## 时间

oracle只有DATE和TIMESTAMP两种
1. DATE格式：YYYY/MM/DD HH24:MI:SS
2. TIMESTAMP是时间戳形式，使用CAST函数将DATE转成TIMESTAMP

获取系统时间：SYSDATE，SYSTIMESTAMP

字符串转成日期
```
TO_DATE('2022-07-11 18:00:00','yyyy-mm-dd hh24:mi:ss')
TO_TIMESTAMP('2020-07-30 20:30:30.123400','yyyy-mm-dd hh24:mi:ss.ff')
```
时间转成字符串：
```
to_char(CREATE_TIME,'yyyy-mm-dd hh24:mi:ss')
to_char(UPDATE_TIME,'yyyy-mm-dd hh24:mi:ss.ff') --ff：6位毫秒值、ff3：3位毫秒值
```
### 时间加减
针对天以内的直接加减
- 加一天：SYSDATE+1 
- 加一分钟：SYSDATE+(1/24/60)


月份以上的用ADD_MONTHS
- 加一个月：ADD_MONTHS(SYSDATE, 1)
- 加一年：ADD_MONTHS(SYSDATE, 12)

INTERVAL函数
- 加一秒：SYSDATE + INTERVAL '1' SECOND
- 加一分：SYSDATE + INTERVAL '1' MINUTE
- 加一小时：SYSDATE + INTERVAL '1' HOUR
- 加一天：SYSDATE + INTERVAL '1' DAY
- 加一个月：SYSDATE + INTERVAL '1' MONTH
- 加一年：SYSDATE + INTERVAL '1' YEAR  
- 减一年：SYSDATE + INTERVAL '-1' YEAR  


截取时间：TRUNC(时间或数字,精度)
- 获取月初第一天：TRUNC(SYSDATE,'MM')

查询条件加日期时间
```
CREATE_TIME >= TO_DATE(TO_CHAR(SYSDATE,'YYYY-MM-DD'),'YYYY-MM-DD') 
AND CREATE_TIME < TO_DATE(TO_CHAR(SYSDATE+1,'YYYY-MM-DD'),'YYYY-MM-DD')
```

时间格式化
```
TO_CHAR(SYSDATE,'yyyy-MM-dd hh:mm:ss')
```
截断时间和数字TRUNC，截取字符串SUBSTR
```
SELECT TRUNC(SYSDATE, 'yy') FROM TB --2022-01-01
SELECT TRUNC(SYSDATE, 'mm') FROM TB --2022-06-01
SELECT TRUNC(SYSDATE, 'dd') FROM TB --2022-06-10
SELECT TRUNC(SYSDATE, 'd') FROM TB --2022-06-05 获取当前星期的第一天（从星期日计算）
SELECT TRUNC(SYSDATE, 'hh') FROM TB --2022-06-10 13:00:00
SELECT TRUNC(SYSDATE, 'mi') FROM TB --2022-06-10 13:22:00（TRUNC没有到秒的）
```
## 跨库查询
首先创建DBLink
```
create public database link tblink
connect to 用户名 identified by 密码
using '(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 数据库地址)(PORT = 端口号)))(CONNECT_DATA =(SERVICE_NAME = 服务器名)))';
```
类型有public和private，tblink表示这个DBLink的名称，随便自己起

删除DBLink
```
drop database link tblink;
--public类型的要增加说明
drop public database link tblink;
```
查看创建的所有的DBLink
```
select * from dba_db_links;
```
查询关联的数据库
```
select * from TB_LOCATION@dblink
```
附上创建和删除dabase link的权限
```
--给WMS附上创建database link的权限
grant create  database link to wms ; 
--给WMS附上创建public database link的权限
grant create public database link to wms ;
--附上删除权限
grant drop public database link to wms; 
```


## 其他操作
链接字符串CONCAT
```
SELECT CONCAT(CONCAT('A', 'B'),'C') FROM TB;--CONCAT函数只能链接两个字符
SELECT CONCAT('let''s', ' go') FROM TB;--带引号的字符
```
链接多个字符串||
```
SELECT 'hello'||':'||'world' FROM TB where ROWNUM<=1
```
将首字母设置为大写Initcap
```
SELECT Initcap('let''s go') FROM TB
```
判断null
```
select NVL(NULL, 1) from TB
```
判断表是否存在
```
SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = UPPER('用户名') AND TABLE_NAME = UPPER('表名')
--或者
SELECT count(*)  FROM user_tables WHERE table_name = upper('表名')
```