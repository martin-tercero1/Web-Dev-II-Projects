const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const handlers = require('./handlers');

const auth = require ('./auth');

router.use(bodyParser.json());

router.param('questionid', handlers.lookupQuestionId);
router.param('answerid', handlers.lookupAnswerId);
// crear un param y bindearlo a una funcion que busque posts

router.get('/questions', handlers.readAllQuestions);
router.post('/questions', auth.requireAuthC, handlers.createQuestion);

router.get('/questions/:questionid', handlers.readQuestion);
router.put('/questions/:questionid', auth.requireAuthC, handlers.updateQuestion);

router.get("/questions/:questionid/answers", handlers.readAnswersForQuestion);
router.post("/questions/:questionid/answers", auth.requireAuthC, handlers.createAnswerForQuestion);

router.get('/answers/:answerid', handlers.readAnswer);
router.put('/answers/:answerid', auth.requireAuthC, handlers.updateAnswer);


router.get('/likes/:postid', auth.requireAuthC,  handlers.getLikesForPost);
router.get('/likes/:postid/:username', auth.requireAuthC, handlers.getLikesForUser);

router.post('/likes/:postid/:username', auth.requireAuthC, handlers.createLike);
router.delete('/likes/:postid/:username', auth.requireAuthC, handlers.deleteLike);

router.delete('/questions', handlers.deletePosts);

router.use(handlers.notFound);

module.exports = router;