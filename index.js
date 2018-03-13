const dgram = require('dgram');
let LBC_Buffer = require('./buffer');

module.exports = new class LBC {
	constructor() {		
		this.logLevels = {
			0: "emergency",
			1: "alert",
			2: "critical",
			3: "error",
			4: "warning",
			5: "notice",
			6: "info",
			7: "debug",
			100: "default"
		}

		/**
		 * servers = [{
		 * 	name, address, port, dataRoot, slicing
		 * }]
		 */
		this.servers = [];		
	}

	startServer(name, port, address = "0.0.0.0", dataRoot = "./", options = {}) {
		let _this = this;
		if (!name) {
			throw new Error(`name is required`);
		}
		if (!port) {
			throw new Error(`port is required`);
		}

		for (let server of this.servers) {
			if (server.name === name) {
				throw new Error(`name ${ name } is exists`);
			}
			if (server.port === port) {
				throw new Error(`port ${ port } is used`);
			}
		}

		let server = dgram.createSocket('udp4');
		server.buffer = new LBC_Buffer(name, dataRoot, options);

		server.on('error', (err) => {
		  console.log(`server error:\n${err.stack}`);
		  server.close();
		});

		server.on('message', (msg, rinfo) => {
			const address = server.address();
			msg = msg.toString();
			let tmp = msg.match(/\<(\d*)\>(.*)/);
			if (tmp && tmp.length >= 2) {
				let code = parseInt(tmp[1]) - 184;
				let level = _this.logLevels[code.toString()] || _this.logLevels[100];
				server.buffer.addBuffer(msg, level);
			} else if (msg) {
				server.buffer.addBuffer(msg, _this.logLevels[100]);   // 接收到的日志没有指定日志级别，则为default级别
			}

			server.receive instanceof Function && server.receive(msg, rinfo, {
				name: server.options.name,
				port: server.options.port,
				address: server.options.address,
				dataRoot: server.options.dataRoot,
				period: server.options.options.period,
				maxSizePerFile: server.options.options.maxSizePerFile
			});
		});

		server.on('listening', () => {
		  const address = server.address();
		  console.log(`server listening ${address.address}:${address.port}`);
		});

		server.bind(port, address);
		server.options = {
			name: name,
			port: port,
			address: address,
			dataRoot: dataRoot,
			options: options
		}
		this.servers.push(server);
		return server;
	}
}();