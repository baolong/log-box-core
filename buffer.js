let IO = require("./IO");
module.exports = class LBC_Buffer {
	constructor(name, dataRoot, options={
		logLevels: ["DEBUG", "ERROR", "FATAL", "INFO", "TRACE", "WARN", "ALERT"],    // 根据这些日志级别分别存储不同级别的日志
		period: 60*10,   // 保存周期，即period秒自动将日志写入文件
		maxSizePerFile: 1024*1024*10,   // 单个日志文件最大默认为10M

	}) {
		let _this = this;
		if (!name) {
			throw new Error(`name is required`);
		}
		if (!dataRoot) {
			throw new Error(`port is required`);
		}
		this.options = {
			name: name,
			dataRoot: dataRoot,
			logLevels: options.logLevels,
			period: options.period,
			maxSizePerFile: options.maxSizePerFile
		};
		this.buffers = [];    // 日志暂存区
		if (this.options.logLevels && this.options.logLevels.length > 0) {
			this.buffers = {};
			// 初始化各级别的日志暂存区
			for (let loglevel of this.options.logLevels) {			
				this.buffers[loglevel] = [];
			}
		}		

		this.IOInstance = new IO(this.options.name, this.options.dataRoot, { maxSizePerFile: this.options.maxSizePerFile });

		this.timer = setInterval(function() {
			if (!_this.options.logLevels) {
				_this.writeLog();
			} else {
				for (let level of _this.options.logLevels) {
					_this.writeLog(level);
				}			
			}			
		}, this.options.period * 1000);
	}


	addBuffer(str, level) {
		let buf = level ? this.buffers[level] : this.buffers;
		if (!buf) {
			return false;
		}

		buf.push(str);
	}


	writeLog(level) {
		let buf = level ? this.buffers[level] : this.buffers;
		if (!buf || buf.length <= 0) {
			return false;
		}
		const bufStr = buf.join("\n");
		buf = buf.splice(0, buf.length);
		this.IOInstance.writeFile(level, bufStr);
	}
}