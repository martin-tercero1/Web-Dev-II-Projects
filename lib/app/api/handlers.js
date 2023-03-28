const { Post } = require('../../models/post');
const { Like } = require("../../models/like");
const logger = require('../../logger');

function methodNotSupported(req, res) {
  res.status(405);
  res.set("Allow", "HEAD, GET, POST");
  res.render("error_page", {
    message: `The resource ${req.originalUrl} does not support ${req.method} requests`,
  });
}

function notFound(req, res) {
  res.status(404);
  res.json({ message: `The resource ${req.originalUrl} was not found` });
}

function internalError(error, req, res, next) {
  logger.error(error);
  res.status(500);
  res.json({ message: 'Internal server error' });
}

// Post model is used for Questions and Answers, the difference is that the reference field is 
//optional and should be used by answers only

async function lookupQuestionId(req, res, next, questionId) {  // ✅
  try {
      let question = await Post.findById(questionId);
      // if it has a reference throw it out
      if (question && !question.reference) {
        res.locals.question = question;
        next();
      } else {
        notFound(req, res);
      }
  } catch (error) {
    internalError(error, req, res)
  }
}

async function lookupAnswerId(req, res, next, answerId) { // ✅
  const answer = await Post.findById(answerId);
  if (answer && answer.reference) {
    res.locals.answer = answer;
    next();
  } else {
    notFound(req, res);
  }
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

async function readQuestion(req, res) { // ✅
    const questionId = res.locals.question.id;
    const question = await Post.findById( { id: questionId } );
    res.json(question);
};

async function updateQuestion(req, res) {  // ✅
  logger.info(res.locals.question);
    let questionId = res.locals.question.id;

    let question = await Post.findOne({id: questionId});

    req.body.summary
      ? (question.summary = req.body.summary)
      : (question.summary = "");

    question.contents = req.body.contents;
    question.author = req.body.author;
    question.edited = Date.now();

    await question.save();
    res.json(question);
};

async function readAnswersForQuestion(req, res) { // ✅
  let questionId = res.locals.question.id;
  let answers = await Post.find({reference:questionId}).select({
      reference: 0
  });
  logger.info(answers);
  res.json(answers);
}

async function createAnswerForQuestion(req, res) {  // ✅
    let questionId = res.locals.question.id;

    let answer = new Post();
    answer.author = req.body.author;
    answer.contents = req.body.contents;
    answer.reference = questionId;
    answer.edited = Date.now();
    answer.created = Date.now();
    answer.likeCount = 0;

    await answer.save();
    res.json(answer);
};

async function readAnswer(req, res) { // ✅
    let answerId = res.locals.answer.id;
    let answer = await Post.findById(answerId);
    res.json(answer);
};

async function updateAnswer(req, res) {  // ✅
    let answerId = res.locals.answer.id;
    logger.info(answerId);
    let answer = await Post.findById(answerId);

    answer.contents = req.body.contents;
    answer.author = req.body.author;
    answer.edited = Date.now();

    await answer.save();
    res.json(answer);
};

async function getLikesForPost(req, res) { // ✅
    let postId = req.params.postid;
    const likes = await Like.find({post: postId}, {'user': 1});
    if(!likes) return notFound(req, res);
    res.json(likes);
} 

async function getLikesForUser(req, res) {
  let liked = await Like.exists({post:req.params.postid} , {user: res.params.username});
  if(!liked) return notFound(req, res);
  res.json(true);
}

async function createLike(req, res) { // ✅
    const like = new Like({user: req.params.username, post: req.params.postid});
    try{
      await Post.updateOne( { id: like.post }, { $inc: {likeCount: 1} } );
      await like.save();
      res.json(true);
    }
    catch(err){
      logger.info("Post has already been liked");
      res.json(true);
    }
}

async function deleteLike(req, res) {
  const posts = await Like.findOne({post:req.params.postid} , {user: res.params.username});
  await posts.save();
  await Post.updateOne({id: post.id }, { $inc: {likeCount:-1} });
  res.json(false);
}

async function deletePosts(req, res) {
  const posts = await Post.findByIdAndDelete({});
  res.json(posts);
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
    deleteLike,
    deletePosts
}