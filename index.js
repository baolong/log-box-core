const dgram = require('dgram');
let LBC_Buffer = require('./buffer');

module.exports = new class LBC {
	constructor() {
		this.servers = [];
		/**
		 * servers = [{
		 * 	dgram, name, address, port, dataRoot, logLevels, slicing
		 * }]
		 */
	}

	startServer(name, port, address = "0.0.0.0", dataRoot = "./", options = {}) {
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
			// do something
			let tmp = msg.match(/\[(....)\](.*)/);
			if (tmp) {
				server.buffer.addBuffer(tmp[2], tmp[1]);
			} else if (msg) {
				server.buffer.addBuffer(msg);
			}

		  server.receive instanceof Function && server.receive(msg, rinfo);
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