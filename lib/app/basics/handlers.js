const { restart } = require("nodemon");

function madlibGET(req, res, next) {
  res.redirect("form.html")
}

function madlibPOST(req, res, next) {
  res.set("Content-Type", "text/html");
}

function birthday(req, res, next) {
  let name, age;

  if (req.query.name) {
      name = req.query.name;
      age = req.query.age;

      req.session.name = name;
      req.session.age = age;
  } else if (req.session.name) {
    name = req.session.name;
    age = req.session.age;
  } else {
    name = "Somebody";
    age = "some";
  }

  res.set("Content-Type", "text/html");

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
  res.set("Content-Type", "text/plain");
  res.send("Hello, world!");
  next()
}

function madlib(req, res){
  res.render('basics/madlib.hbs', {req});
}

module.exports = {
  birthday,
  helloWorld, 
  madlibGET,
  madlibPOST
};
