let fs = require("fs");
let path = require("path");

function mkdirsSync(dirname, mode){
	if(fs.existsSync(dirname)){
		return true;
	}else{
    if(mkdirsSync(path.dirname(dirname), mode)){
        fs.mkdirSync(dirname, mode);
        return true;
    }
	}
}


Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
	    "M+": this.getMonth() + 1, //月份 
	    "d+": this.getDate(), //日 
	    "h+": this.getHours(), //小时 
	    "m+": this.getMinutes(), //分 
	    "s+": this.getSeconds(), //秒 
	    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	    "S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}


let writeBuffer = (buffers, options) => {
	let date = new Date().Format("yyyy-MM-dd");	
	
	while( buffers.length>0 ) {
		let buf = buffers.shift();
		if (!buf || !buf.buffer) {
			continue;
		}
		let filepath = `${ options.dataRoot }/${ options.name }/${ date }` + (typeof buf.level != "undefined" && buf.level ? `/${ buf.level }` : "");
		if (!fs.existsSync(filepath)) {
			mkdirsSync(filepath);
		}
		const files = fs.readdirSync(filepath);
		let len = files.length;		
		if (len <= 0) {
			fs.writeFileSync(filepath + "/1.log", "");
			len = 1;
		}
		let fileStatus = fs.statSync(`${ filepath }/${ len }.log`);
		let filename = len;
		if (fileStatus.size >= options.maxSizePerFile) {
			filename = len + 1;
		}

		fs.writeFileSync(filepath + `/${ filename }.log`, buf.buffer, { flag: "a" });
	}
}

module.exports = class IO {
	constructor(name, dataRoot, options={
		maxSizePerFile: 1024*1024*10,   // 单个日志文件最大默认为10M
	}) {
		if (!name) {
			throw new Error(`name is required`);
		}
		if (!dataRoot) {
			throw new Error(`port is required`);
		}
		this.options = {
			name: name,
			dataRoot: dataRoot,
			maxSizePerFile: options.maxSizePerFile
		};
		this.queue = [];    // 日志队列
	}


	writeFile(level, buffer) {		
		this.queue.push({
			level: level,
			buffer: buffer
		});
		writeBuffer(this.queue, this.options);
	}	
};