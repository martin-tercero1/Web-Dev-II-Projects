const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const handlers = require('./handlers');

router.use(bodyParser.json());

router.param('questionid', handlers.lookupQuestionId);
router.param('answerid', handlers.lookupAnswerId);

router.get('/questions', handlers.readAllQuestions);
router.post('/questions', handlers.createQuestion);

router.get('/questions/:questionid', handlers.readQuestion);
router.put('/questions/:questionid', handlers.updateQuestion);

router.get("/questions/:questionid/answers", handlers.readAnswersForQuestion);
router.post("/questions/:questionid/answers", handlers.createAnswerForQuestion);

router.get('/answers/:answerid', handlers.readAnswer);
router.put('/answers/:answerid', handlers.updateAnswer);


router.get('/likes/:postid', handlers.getLikesForPost);
router.get('/likes/:postid/:username', handlers.getLikesForUser);

router.post('/likes/:postid/:username', handlers.createLike);
router.delete('/likes/:postid/:username', handlers.deleteLike);

// router.delete('/questions', handlers.deletePosts);

router.use(handlers.notFound);

module.exports = router;