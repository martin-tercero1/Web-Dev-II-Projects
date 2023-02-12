const { restart } = require("nodemon");

function birthday(req, res, next) {
  let name, age;
  name = req.query.name || req.session.name|| "Somebody";
  age = req.query.age || req.session.age||"some";
  req.session.name = name;
  req.session.age = age;  

  res.send(
    `<h1>Happy Birthday, ${name}!</h1>
        <p>
            How does it feel being ${age} years old?
        </p>`
  );
  next();
}

function helloWorld(req, res, next) {
  res.status(200);
  res.setHeader("Content-Type", "text/plain");
  res.send("Hello, world!");
  next();
}

function madlib(req, res){
  res.render('basics/madlib.hbs', {req});
}

module.exports = {
  birthday,
  helloWorld,
  madlib
};
