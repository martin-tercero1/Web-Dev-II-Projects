const express = require("express");
const router = express.Router();
const config = require("../../config");
const bodyParser = require("body-parser");

// app.use(bodyParser.urlenconded({ extended : false }));

router.use(function (req, res, next) {
  next();
});

router
   .route("/birthday")
   .get((req, res) => {
        let name = req.query.name || "Somebody";
        let age = req.query.age || "some";

        res.send(
        `<h1>Happy Birthday, ${name}!</h1>
        <p>
            How does it feel being ${age} years old?
        </p>`
        );
    });

router  
    .route("/madlib")
    .post((req, res)=>{
        res.send()
    })
    .get((req, res) => {
        res.redirect(307,"/form.html");
    })


// second-to-last route: try to find a file
router.use("/form.html", (req, res) => {
    logger.info(config.staticDir);
});


module.exports = router;
