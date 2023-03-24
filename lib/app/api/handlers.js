const common = require('./common');
const { Post } = require('../../models/post');
const { Like } = require("../../models/like");

// Post model is used for Questions and Answers, the difference is that the reference field is optional and should be used by answers only

async function lookupQuestionId(req, res, next, questionId) {
  res.locals.question = await Question.findById(questionId);

  if (question) {
    res.locals.question = question;
    next();
  } else {
    common.notFound(req, res);
  }
}

async function lookupAnswerId(req, res, next, answerId) {
  res.locals.answer = await Answer.findById(answerId);
  next();
}

async function readAllQuestions(req, res) {
    const questions = await Question.find();
    res.json(questions);
}

async function createQuestion() {

};

async function readQuestion() {

};

async function updateQuestion() {

};

async function readAnswersForQuestion() {

};
async function createAnswerForQuestion() {

};

async function readAnswer() {

};

async function updateAnswer() {

};

module.exports = { 
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