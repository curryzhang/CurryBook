---
title: Linux安装Redis
icon: page
order: 3
author: curryzhang
date: 2022-12-05
category:
  - Linux
tag:
  - Linux
  - Redis
# 是否置顶
# sticky: true
# 是否收藏
star: true
---

查看版本
```
cat /etc/redhat-release
```

安装文件互相引用时，一起安装(本地安装方式)
```
rpm -ivh glibc-2.12-1.132.e16.x86_64.rpm glibc-common-2.12-1.132.e16.x86_64.rpm
```

### yum镜像修改

之前一直报错，运行：yum info yum

```
Error：Failed to download metadata for repo 'AppStream': Cannot prepare internal mirrorlist: No URLs in mirrorlist
```

处理方法：将镜像改成：vault.centos.org，然后更新

```
cd /etc/yum.repos.d/
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
yum update -y
```

##### 安装gcc

```
yum install gcc-c++
```

##### 下载redis
 ```
 wget http://download.redis.io/releases/redis-6.0.8.tar.gz
 --解压
 tar xzf redis-6.0.8.tar.gz
 ```

进入解压后文件夹执行：mark
```cd redis-6.0.8
make
```

#### 启动redis
```cd src
./redis-server
```

通过指定文件启动redis

```./redis-server ../redis.conf
./redis-server ../redis.conf
```

再开启一个客户端连接redis服务

```
cd src
./redis-cli
redis> set name curry
redis> get name
```

##### 关闭重启redis

```
./redis-cli -h 127.0.0.1 -p 6379 shutdown
```

