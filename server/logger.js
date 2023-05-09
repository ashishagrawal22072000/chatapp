var winston = require('winston')

var logger = winston.createLogger({
	levels: winston.config.npm.levels,
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({ format: winston.format.simple() })
	]
});

module.exports = logger