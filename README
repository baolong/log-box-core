# log-box-core 日志收集服务核心插件

<code>
const LBC = require('log-box-core');

// 创建新日志收集服务
let logServer = LBC.startServer("aaa", 9997, "0.0.0.0", "./log", {
	logLevels: null, //["DEBUG", "ERROR", "FATAL", "INFO", "TRACE", "WARN", "ALERT"],       // 根据这些日志级别分别存储不同级别的日志，为空则不区分级别
	period: 60,       // 缓存周期，60秒自动将缓存写入文件
	maxSizePerFile: 1024*1024*10    // 每个日志文件大小限制为10M
});
logServer.receive = (msg, info) => {
	console.log(msg);
}
</code>