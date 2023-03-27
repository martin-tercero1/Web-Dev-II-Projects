const { Post } = require('../../models/post');
const { Like } = require("../../models/like");
const logger = require('../../logger');


function methodNotSupported(req, res) {
  res.status(405);
  res.set("Allow", "HEAD, GET, POST");
  res.render("error_page", {
    message: `This url does not support ${req.method} requested`,
  });
}

function notFound(req, res) {
  res.status(404);
  res.json({ message: 'Requested resource not found' });
}

function internalError(error, req, res, next) {
  logger.error(error);
  res.status(500);
  res.json({ message: 'Internal server error' });
}

// Post model is used for Questions and Answers, the difference is that the reference field is optional and should be used by answers only

async function lookupQuestionId(req, res, next, questionId) {
  let question = await Post.findById(questionId);

  if (question) {
    res.locals.question = question;
    next();
  } else {
    notFound(req, res);
  }
  //res.json(question);
}

async function lookupAnswerId(req, res, next, answerId) { // ✅
  let answer = await Post.findById(answerId);

  if (answer) {
    res.locals.answer = answer;
    next();
  } else {
    notFound(req, res);
  }
  //res.json(answer);
}

async function readAllQuestions(req, res) { // ✅
    const questions = await Post.find( { reference: undefined } ).select({
      contents: 0
    });
    res.json(questions);
}

async function createQuestion(req, res) { // ✅
    let question = new Post();

    question.summary = req.body.summary;
    question.contents = req.body.contents;
    question.author = req.body.author;
    question.reference = undefined;
    question.edited = Date.now();
    question.created = Date.now();
    question.likeCount = 0;

    await question.save();
    res.json(question); 
};

async function readQuestion(req, res) {
    const questionId = res.locals.question.id;
    const question = await Post.findById(questionId);
    res.json(question);
    //logger.info("read");
};

async function updateQuestion(req, res) {
  let question = await Post.findById(res.locals.question.id);
  //throwing error
  req.body.summary
  ? (question.summary = req.body.summary)
  : (question.summary);
  
  question.contents = req.body.contents;
  question.author = req.body.author;
  question.edited=Date.now();

    await question.save();
    res.json(question);
};

async function readAnswersForQuestion(req, res) {
    const answersToQ = await Post.find( { reference: res.locals.question.id } ).select({
      reference: 0
    });

    res.json(answersToQ);
};

async function createAnswerForQuestion(req, res) {
    const answer = new Post();
    answer.contents = req.body.contents;
    answer.author = req.body.author;
    answer.reference = res.locals.question.id;
    answer.created = answer.edited = Date.now();
    answer.likeCount = 0;
    await answer.save();
    res.json(answer);
};

async function readAnswer(req, res) { // ✅
    const answer = await Post.findById(res.locals.answer.id);
    res.json(answer);
};

async function updateAnswer(req, res) {
    const answer = await Post.findById(res.locals.answer.id);
    answer.contents = req.body.contents;
    answer.author = req.body.author;
    answer.edited = Date.now();

    await answer.save();
    res.json(answer);
};

async function getLikesForPost(req, res) {
    const likeNum = await Post.findById(req.params.postid).select({author:1});
    res.json(likeNum);
} 

async function getLikesForUser(req, res) {

}

async function createLike(req, res) {

}

async function deleteLike(req, res) {

}

module.exports = {
    notFound,
    methodNotSupported,
    internalError,
    lookupQuestionId,
    lookupAnswerId,
    readAllQuestions,
    createQuestion,
    readQuestion,
    updateQuestion,
    readAnswersForQuestion,
    createAnswerForQuestion,
    readAnswer,
    updateAnswer,
    getLikesForPost,
    getLikesForUser,
    createLike,
    deleteLike
}