# log-box-core 日志收集服务核心插件

使用方法：

LBC.startServer("日志服务名", port, ip, "日志保存路径", options);

```javascript
let LBC = require('log-box-core');

// 创建新日志收集服务
let logServer = LBC.startServer("aaa", 9997, "0.0.0.0", "./log", {
	logLevels: ["DEBUG", "ERROR", "FATAL", "INFO", "TRACE", "WARN", "ALERT"],       // 根据这些日志级别分别存储不同级别的日志，为空则不区分级别
	period: 60,       // 缓存周期，60秒自动将缓存写入文件
	maxSizePerFile: 1024*1024*10    // 每个日志文件大小限制为10M
});

// 监听日志收集回调，可用于实时获取日志并显示在后台
logServer.receive = (msg, info) => {
	console.log(msg);
}
```