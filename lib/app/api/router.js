const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const handlers = require('./handlers');
const auth = require ('./auth');

router.use(bodyParser.json());

router.param('questionid', handlers.lookupQuestionId);
router.param('answerid', handlers.lookupAnswerId);

router.get('/questions', handlers.readAllQuestions);
router.post('/questions', auth.requireAuthC, handlers.createQuestion);
router.all('/questions', (req, res) => {
    res.status(405);
    res.set('Allow', 'HEAD, GET, POST');
   res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.get('/questions/:questionid', handlers.readQuestion);
router.put('/questions/:questionid', auth.requireAuthC, handlers.updateQuestion);
router.all("/questions/:questionid", (req, res) => {
  res.status(405);
  res.set("Allow", "HEAD, GET, PUT");
 res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.get("/questions/:questionid/answers", handlers.readAnswersForQuestion);
router.post("/questions/:questionid/answers", auth.requireAuthC, handlers.createAnswerForQuestion);
router.all("/questions/:questionid/answers", (req, res) => {
  res.status(405);
  res.set("Allow", "HEAD, GET, POST");
 res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.get('/answers/:answerid', handlers.readAnswer);
router.put('/answers/:answerid', auth.requireAuthC, handlers.updateAnswer);
router.all("/answers/:answerid", (req, res) => {
    res.status(405);
    res.set('Allow', 'HEAD, GET, PUT');
   res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.get('/likes/:postid', auth.requireAuthC,  handlers.getLikesForPost);
router.all("/likes/:postid/", (req, res) => {
  res.status(405);
  res.set("Allow", "HEAD, GET");
 res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.get('/likes/:postid/:username', auth.requireAuthC, handlers.getLikesForUser);
router.all("/likes/:postid/:username", (req, res) => {
    res.status(405);
    res.set('Allow', 'HEAD, GET');
   res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.post('/likes/:postid/:username', auth.requireAuthC, handlers.createLike);
router.delete('/likes/:postid/:username', auth.requireAuthC, handlers.deleteLike);
router.all("/likes/:postid/:username", (req, res) => {
  res.status(405);
  res.set("Allow", "HEAD, GET, DELETE");
 res.json({message: `The resource ${req.originalUrl} does not support ${req.method} requests`})
});

router.delete('/questions', handlers.deletePosts);

router.use(handlers.internalError);

module.exports = router;