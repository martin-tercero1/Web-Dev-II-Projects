const express = require('express');
const expressSession = require('express-session');
const config = require("../config");
const morgan = require("morgan");
const basics = require("./basics")

const logger = require('../logger');
const bodyParser = require("body-parser");

const app = express();

function helloWorld(req, res, next) {
  if (req.url != "/hello") {
    res.status(404);
    res.setHeader("Content-Type", "text/plain");
    res.send("Not found");
  } else {
    res.status(200);
    res.setHeader("Content-Type", "text/plain");
    res.send("Hello, world!");
  }
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan(config.morgan));

// Session
app.use(
  expressSession({
    // secret is used to sign the session
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false,
  })
);

// Features
app.use("/basics", basics.router);

app.use(helloWorld);

module.exports = app;