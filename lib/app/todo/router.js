const express = require("express");
const router = express.Router();
const config = require("../../config");
const handlers = require("./handlers");

router.use(function (req, res, next) {
  next();
});

router
  .route("")
  .get(handlers.redirectList);

router
   .route("/")
   .get(handlers.redirectList);

// HTML
router
    .route("/list")
    .get(handlers.listWebPage)

router.post("/add", handlers.addNewItem);

router.post("/save", handlers.saveMarkedItem);

router.post("/remove", handlers.removeCompletedItems);

//router.use(express.static(config.staticDir));

module.exports = router;