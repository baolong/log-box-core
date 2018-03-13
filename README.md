# log-box-core 基于Nodejs的日志收集服务插件
#### 基于Nodejs的日志收集服务插件
***
Nodejs客户端插件：[log-box-cli](https://www.npmjs.com/package/log-box-cli)

### 安装：

```javascript
npm install log-box-core;
```

### 使用方法：

```javascript
let LBC = require('log-box-core');

// 创建新日志收集服务
let logServer = LBC.startServer("aaa", 9997, "0.0.0.0", "./log", {
	period: 60,       // 缓存写入周期，单位：秒
	maxSizePerFile: 1024*1024*10    // 单个日志文件大小限制，单位：字节
});

// 监听日志收集回调，可用于实时获取日志并显示在后台
logServer.receive = (msg, info, serverInfo) => {
	console.log(msg);
}
```


API：

	/**
	 * @param String name   必填  服务名称（唯一）
	 * @param String port   必填  端口
	 * @param String ip    必填  绑定到本地的某个IP地址
	 * @param String dataRoot 必填  日志根目录
	 * @param String options  非必填  其它配置项
	 * @param String options.period  非必填  缓存的保存周期，单位：秒，默认为10分钟
	 * @param String options.maxSizePerFile  非必填  单个日志文件最大字节数，默认为10M
	 **/
	LBC.startServer(name, port, ip, dataRoot, options);



	/**
	 * @param String msg        日志原始内容
	 * @param String info       日志信息
	 * @param String serverInfo     服务信息
	 * @param String serverInfo.name      服务名
	 * @param String serverInfo.port      端口
	 * @param String serverInfo.address   绑定的IP地址
	 * @param String serverInfo.dataRoot  日志文件根路径
	 * @param String serverInfo.period    缓存周期
	 * @param String serverInfo.maxSizePerFile     当个文件最大限制
	 **/
	LBC.receive(function(msg, info, serverInfo) {
		console.log(msg);
		console.log(serverInfo);
	});