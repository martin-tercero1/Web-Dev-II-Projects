const { Post } = require('../../models/post');
const { Like } = require("../../models/like");

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
  res.locals.question = await Post.findById(questionId);

  if (question) {
    res.locals.question = question;
    next();
  } else {
    notFound(req, res);
  }
  res.json(question);
}

async function lookupAnswerId(req, res, next, answerId) {
  res.locals.answer = await Post.findById(answerId);

  if (answer) {
    res.locals.answer = answer;
    next();
  } else {
    notFound(req, res);
  }
  res.json(answer);
}

async function readAllQuestions(req, res) {
    const questions = await Post.find();
    res.json(questions);
}

async function createQuestion(req, res) {
    let question = new Post();

    question.summary = req.body.summary;
    question.contents = req.body.contents;
    question.author = req.body.author;

    await question.save();
    res.json(question);
};

function readQuestion(req, res) {
    res.json(res.locals.question);
};

async function updateQuestion(req, res) {
    let question = res.locals.question;

    question.summary = req.body.summary;
    question.contents = req.body.contents;
    question.author = req.body.author;

    await question.save();
    res.json(question);
};

async function readAnswersForQuestion(req, res) {

};
async function createAnswerForQuestion(req, res) {

};

async function readAnswer(req, res) {
    res.json(res.locals.answer);
};

async function updateAnswer(req, res) {

};

async function getLikesForPost() {
  
}

async function getLikesForUserPost() {

}

async function createLike() {

}

async function deleteLike() {

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
    updateAnswer 
}