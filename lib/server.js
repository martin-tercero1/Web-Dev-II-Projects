// To handle HTTP requests
const http = require('http');

const app = require('./app');

const config = require('./config');
const logger = require('./logger');

// Create the server
const server = http.createServer(app);

// Start the server
server.listen(config.httpPort, () => {
    // This is called once the server is running
    logger.info(`Server listening on port ${config.httpPort}...`);
});