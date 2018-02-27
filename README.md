# log-box-core 基于Nodejs的日志收集服务插件

使用方法：

LBC.startServer("日志服务名", port, ip, "日志保存路径", options);

```javascript
let LBC = require('log-box-core');

// 创建新日志收集服务
let logServer = LBC.startServer("aaa", 9997, "0.0.0.0", "./log", {
	period: 60,       // 缓存写入周期，单位：秒
	maxSizePerFile: 1024*1024*10    // 单个日志文件大小限制，单位：字节
});

// 监听日志收集回调，可用于实时获取日志并显示在后台
logServer.receive = (msg, info) => {
	console.log(msg);
}
```