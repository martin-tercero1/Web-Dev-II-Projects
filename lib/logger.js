const config = require('./config');

const winston = require("winston");

// Defines levels; 0 = highest level
const levels = {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 6
};

// Defines colors for CLI format
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue',
    trace: 'grey',
};

const logger = winston.createLogger({
  levels,
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.errors(),
    winston.format.timestamp(),
    winston.format.cli({levels, colors})
  ),
  transports: new winston.transports.Console(),
});

logger.httpStream = {
  write(message) {
    logger.http(message);
  },
};

module.exports = logger;