---
title: signalr使用
icon: page
order: 7
author: curryzhang
date: 2023-02-15
category:
  - signalr
  - Vue
  - .Net Core
tag:
  - Vue
  - .Net Core
# 是否置顶
# sticky: true
# 是否收藏
star: true
---

### 前端
Vue安装Signalr：npm install @microsoft/signalr  

> 安装后报错，一直解决不了，怀疑是版本太高，下载后安装了5.0.3版本的，错误消失。

新建signalr.js
```
import * as signalR from '@microsoft/signalr'

const connection = new signalR.HubConnectionBuilder()//服务器地址
    .withUrl('http://localhost:5038/chathub', {})
    .withAutomaticReconnect()
    .build()

export default {
    install: function (Vue) {
        Vue.prototype.signalr = connection
    }
}
```
main.js中引入
```
import signalr from './utils/signalr'
Vue.use(signalr)
```
调用的页面
```
created() {
  this.signalr.off('ReceiveMsg');
  this.signalr.on('ReceiveMsg', res => {
    console.log(res);
  })
},
mounted() {
  this.signalr.start().then(() => {
    console.log('连接');
  })
},
 methods: {
    sendMsg() {
        this.signalr.invoke("SendMessage", this.form.msg , "C77DE392-E003-428D-9FC1-FFEF6AE6BCF8");
    }
}
```

### 后端
Signalr在.net core中已经包含在Microsoft.AspNetCore.App，是一个ASP.NET Core中间件。
```
builder.Services.AddSignalR();

app.MapHub<ForumHub>("/chathub");
```
新建ChatHub类，集成Hub
```
public class ChatHub : Hub
{
    public static List<User> users = new List<User>();
    protected readonly ILogger<ChatHub> _logger;
    public ChatHub(ILogger<ChatHub> logger)
    {
        _logger = logger;
    }

    public async Task SendMessage(string msg, string connectId)
    {
        await Clients.Client(connectId).SendAsync("ReceiveMsg", "curry：" + msg + Environment.NewLine);
    }

    /// <summary>
    /// 重写连接事件
    /// </summary>
    /// <returns></returns>
    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    /// <summary>
    /// 重写断开连接事件
    /// </summary>
    /// <returns></returns>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdateData(object data)
    {
        string connectionId = string.Empty;
        //给所有人发消息
        await Clients.All.SendAsync("客户端接收方法", data);
        //分组（users）发消息
        await Clients.Group("users").SendAsync("客户端接收方法", data);
        //给调用方法的人发送消息
        await Clients.Caller.SendAsync("客户端接收方法", data);
        //给除了调用方以外的人发消息
        await Clients.Others.SendAsync("客户端接收方法", data);
        //给指定connectionId的人发送消息
        await Clients.User(connectionId).SendAsync("客户端接收方法", data);
        await Clients.Client(connectionId).SendAsync("客户端接收方法", data);
        //给多个指定connectionId的人发送消息
        string connectionId1 = string.Empty;
        string connectionId2 = string.Empty;
        await Clients.Clients(connectionId, connectionId1, connectionId2).SendAsync("客户端接收方法", data);
    }
}
```
## 加权
使用jwt授权时，ChatHub增加特性[Authorize]的同时，在Program.cs中对JWT增加OnMessageReceived事件
```
options.Events = new JwtBearerEvents
{
    OnMessageReceived = (context) =>
    {
        if (!context.HttpContext.Request.Path.HasValue)
        {
            return Task.CompletedTask;
        }
        //重点在于这里；判断是Signalr的路径
        var accessToken = context.HttpContext.Request.Query["access_token"];
        var path = context.HttpContext.Request.Path;
        if (!(string.IsNullOrWhiteSpace(accessToken)) && path.StartsWithSegments("/chathub"))
        {
            context.Token = accessToken;
            return Task.CompletedTask;
        }
        return Task.CompletedTask;
    },

    OnChallenge = context =>
    {
        context.HandleResponse();
        context.Response.Clear();
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        var res = "{\"code\":401,\"message\":\"授权未通过\"}";
        context.Response.WriteAsync(res);
        return Task.CompletedTask;
    }
};
```
同时前端需要修改url，加上Token
```
const connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl("http://localhost:5038/chathub", { accessTokenFactory: () => token })
    .build()
```


参考：https://docs.microsoft.com/zh-cn/aspnet/core/signalr/authn-and-authz?view=aspnetcore-6.0
参考：https://docs.microsoft.com/zh-cn/aspnet/core/signalr/configuration?view=aspnetcore-6.0&tabs=javascript