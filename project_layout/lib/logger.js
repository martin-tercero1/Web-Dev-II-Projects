const config = require('./config');

const winston = require("winston");

module.exports = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.errors(),
    winston.format.timestamp(),
    winston.format.cli()
  ),
  transports: new winston.transports.Console(),
});