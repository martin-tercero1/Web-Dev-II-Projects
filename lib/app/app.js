const express = require('express');
const expressSession = require('express-session');
const config = require('../config');
const morgan = require('morgan');

const basics = require('./basics');
const handlers = require('./basics/handlers');

const todo = require('./todo');

const api = require('./api')

const bodyParser = require('body-parser');
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

// Features
app.use('/hello', handlers.helloWorld);

app.use('/basics', basics.router);

app.use('/todo', todo.router);

app.use('/api', api.router);

app.use(express.static(config.staticDir));

// last thing: not found
app.use((req, res) => {
  res.status(404);
  res.json({ message: `The resource ${req.originalUrl} was not found` });
});

module.exports = app;