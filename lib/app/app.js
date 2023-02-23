const express = require('express');
const expressSession = require('express-session');
const config = require("../config");
const morgan = require("morgan");

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

// Features
app.use("/basics", basics.router);

app.use("/todo", todo.router);

app.use(express.static(config.staticDir));

// last thing: not found
app.use((req, res) => {
  res.status(404);
  res.type("text/html");
  res.send(
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css"/>
</head>
<body>
    <div class="container">
      <h1>Not Found</h1>
  </div>
</body>
</html>`);
});

module.exports = app;