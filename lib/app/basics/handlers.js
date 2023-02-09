function birthdayMethod(req, res) {
  let name = req.query.name || "Somebody";
  let age = req.query.age || "some";

  res.send(
    `<h1>Happy Birthday, ${name}!</h1>
        <p>
            How does it feel being ${age} years old?
        </p>`
  );
}

module.exports = {
    birthdayMethod,
    formMethod,
    madlibMethod
}