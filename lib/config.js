const path = require("path");
const logger = require("./logger");

function projectPath(...localPaths) {
  console.log(path.join(__dirname, "..", ...localPaths))
  return path.join(__dirname, "..", ...localPaths);
}

module.exports = {
  httpPort: 8001,
  staticDir: projectPath("/static"),
  logLevel: "info",
  viewsDir: projectPath('views'),
  sessionSecret: "bunnyslippers",
  morganFormat: "dev"
};
