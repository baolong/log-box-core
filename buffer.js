let IO = require("./IO");
module.exports = class LBC_Buffer {
	constructor(name, dataRoot, options={
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
			period: options.period,
			maxSizePerFile: options.maxSizePerFile
		};
		this.buffers = {};    // 日志暂存区

		this.IOInstance = new IO(this.options.name, this.options.dataRoot, { maxSizePerFile: this.options.maxSizePerFile });

		this.timer = setInterval(function() {
			for (let level in _this.buffers) {
				_this.writeLog(level);
			}
		}, this.options.period * 1000);
	}


	addBuffer(str, level) {
		if (!level) {
			return false;
		}
		this.buffers[level] = this.buffers[level] || [];
		this.buffers[level].push(str);
	}


	writeLog(level) {
		let buf = this.buffers[level];
		if (!buf || buf.length <= 0) {
			return false;
		}
		let bufTemp = [];
		let count = 0;
		while(buf.length && count < 200) {
			count++;
			bufTemp.push(buf.shift());
		}
		let bufStr = bufTemp.join("\r\n");
		bufStr += "\r\n";
		this.IOInstance.writeFile(level, bufStr);
	}
}