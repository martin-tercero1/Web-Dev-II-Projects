function birthday(req, res, next) {
  let name = req.query.name || "Somebody";
  let age = req.query.age || "some";

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

module.exports = {
  birthday,
  helloWorld
};
