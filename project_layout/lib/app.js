const express = require('express');
const logger = require('./logger');

function helloWorld(req, res, next) {
  if (req.url != '/hello') {
    res.status(404);
    res.setHeader('Content-Type', 'text/plain');
    res.send('Not found');
  } else {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.send('Hello, world!');
  }
}

const app = express();

app.use(helloWorld);

module.exports = app;