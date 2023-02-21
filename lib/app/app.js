const express = require('express');
const expressSession = require('express-session');
const config = require("../config");
const morgan = require("morgan");
var path = require('path');
const basics = require("./basics");
const handlers = require("./basics/handlers");

const todo = require("./todo");

const bodyParser = require("body-parser");
const expressHandlebars = require('express-handlebars');


const app = express();

app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));
app.set('view engine', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));
app.set('views', config.viewsDir);

app.use(morgan(config.morgan));

app.use(bodyParser.urlencoded({ extended: false }));

// Session
app.use(
  expressSession({
    // secret is used to sign the session
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false,
  })
);

app.use("/hello", handlers.helloWorld);

app.use("/static", express.static('./static/'));

// Features
app.use("/basics", basics.router);

app.use("/todo", todo.router);

// last thing: not found
app.use((req, res) => {
  res.status(404);
  res.type("text/plain");
  res.send("Not found");
});

module.exports = app;