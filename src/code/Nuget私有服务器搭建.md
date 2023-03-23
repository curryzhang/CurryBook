---
title: Nuget私有服务器搭建
icon: page
order: 4
author: curryzhang
date: 2022-07-15
category:
  - Nuget
tag:
  - Nuget
# 是否置顶
# sticky: true
# 是否收藏
star: true
---

## Nuget私有服务器搭建

首先我选择了BaGet来搭建，其他的还有NuGet.Server、ProGet、MyGet等。BaGet支持.net core，目前是3.1版本

BaGet地址：https://github.com/loic-sharma/BaGet

下载Release包：BaGet.zip，直接解压后执行命令：dotnet  BaGet.dll

若发生错误，一般情况有以下几种：

1. 未安装IIS
2. 端口5000、5001被占用
3. 本地未安装3.1运行时

端口可以直接修改appsetting.json文件，修改了端口号，同时设置了key

```
"ApiKey": "curryzhang",
"Urls":"http://*:5008",
"PackageDeletionBehavior": "Unlist",
"AllowPackageOverwrites": false,
```

安装3.1的运行时，包含两个：ASP.NET Core 运行时、.NET 运行时 

再次执行dotnet  BaGet.dll

### 部署到服务器IIS上

首先创建应用程序池，设置无托管代码

![image-20220715092454263.png](https://upload-images.jianshu.io/upload_images/1708638-e6bc775223650d1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接着新建网站绑定即可。

### 上传包到服务器

项目右击-->打包，完成后到目录下执行命令：

![image-20220715093017874.png](https://upload-images.jianshu.io/upload_images/1708638-c19a0d12e3c5bf1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上传命令在网站上有，因为我们设置了key，所有执行

```
dotnet nuget push -s http://180.76.128.139:5008/v3/index.json 包的名称.nupkg -k curryzhang
```

### 项目使用包

首先打开Nuget包管理器，添加源，接着直接搜索就可以了。

![image-20220715093724311.png](https://upload-images.jianshu.io/upload_images/1708638-8926ba3db725cabc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)