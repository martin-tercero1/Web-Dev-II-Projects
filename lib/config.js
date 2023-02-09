const path = require("path");

function projectPath(...localPaths) {
  return path.join(__dirname, "..", ...localPaths);
}

module.exports = {
  httpPort: 8000,
  staticDir: projectPath("static"),
  logLevel: "info",
  sessionSecret: "bunnyslippers",
  morganFormat: "dev"
};
