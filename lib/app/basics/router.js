const express = require("express");
const router = express.Router();
const config = require("../../config");
const handlers = require("./handlers");
const logger = require("../../logger");

// app.use(bodyParser.urlenconded({ extended : false }));

router.use(function (req, res, next) {
  next();
});

router
   .route("/birthday")
   .get(handlers.birthday);

router  
    .route("/madlib")
    .post((req, res, next)=>{
        res.send(),
        next()
    })
    .get((req, res, next) => {
        res.redirect(307, "/form.html");
        next()
    })


router.use(express.static(config.staticDir));


module.exports = router;