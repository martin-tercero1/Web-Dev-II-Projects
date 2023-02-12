const logger = require("../../logger");

function madlibGET(req, res, next) {
  res.redirect("form.html")
  next()
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
  
function madlibPOST(req, res, next) {
  const data = {
    time: req.body.time || "time",
    furniture: req.body.furniture || "furniture",
    thing: req.body.thing || "thing",
    condition: req.body.thing || 'condition',
    good: req.body.good || 'good',
    bad: req.body.bad || 'bad',
    event: req.body.event || 'event',
    activity: req.body.activity || 'activity'
  }
  res.render("basics/madlib.hbs", {data});
}

function helloWorld(req, res, next) {
  res.status(200);
  res.set("Content-Type", "text/plain");
  res.send("Hello, world!");
  next()
}

module.exports = {
  birthday,
  helloWorld, 
  madlibGET,
  madlibPOST
};
