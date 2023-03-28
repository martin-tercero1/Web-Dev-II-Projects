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

function internalError(err, req, res, next) {
    if (err.name === "SyntaxError") {
      res.status(400);
      res.json({ message: err.message });
    }

    if (err.name === "ValidationError") {
      res.status(400);
      res.json({ message: err.message });
    }

    if (err.name === "MongoServerError" && err.code === 11000) {
      res.status(400);
      res.json({ message: err.message });
    }

    res.status(500);
    res.json({ message: "The server encountered an unexpected error" });
}

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
    internalError(error, req, res);
  }
}

async function lookupAnswerId(req, res, next, answerId) { // ✅
  try {
    const answer = await Post.findById(answerId);
    if (answer && answer.reference) {
      res.locals.answer = answer;
      next();
    } else {
      notFound(req, res);
    }
  } catch (error) {
    internalError(error, req, res);
  }
}

async function readAllQuestions(req, res) { // ✅
    try {
      const questions = await Post.find( { reference: undefined } ).select({
        contents: 0
      });
      res.json(questions);
    } catch (error) {
      internalError(error, req, res, next);
    }
}

async function createQuestion(req, res) { // ✅
    try {
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
    } catch (error) {
      logger.info(error);
      internalError(error, req, res);
    }
};

async function readQuestion(req, res) { // ✅
  try {
    const questionId = res.locals.question.id;
    const question = await Post.findById( { id: questionId } );
    res.json(question);
  } catch (error) {
    internalError(error, req, res, next);
  }
};

async function updateQuestion(req, res) {  // ✅
  try {
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
  } catch (error) {
    internalError(error, req, res, next);
  }
};

async function readAnswersForQuestion(req, res) { // ✅
  try {
    let questionId = res.locals.question.id;
    let answers = await Post.find({reference:questionId}).select({
        reference: 0
    });
    res.json(answers);
  } catch (error) {
    internalError(error, req, res, next);
  }
}

async function createAnswerForQuestion(req, res) {  // ✅
    try {
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
    } catch (error) {
      internalError(error, req, res, next);
    }
};

async function readAnswer(req, res) { // ✅
    try {
      let answerId = res.locals.answer.id;
      let answer = await Post.findById(answerId);
      res.json(answer);
    } catch (error) {
      internalError(error, req, res, next);
    }
};

async function updateAnswer(req, res) {  // ✅
    try {
      let answerId = res.locals.answer.id;
      let answer = await Post.findById(answerId);
  
      answer.contents = req.body.contents;
      answer.author = req.body.author;
      answer.edited = Date.now();
  
      await answer.save();
      res.json(answer);
    } catch (error) {
      internalError(error, req, res, next);
    }
};

async function getLikesForPost(req, res) { // ✅
    try {
      let postId = req.params.postid;
      const likes = await Like.find({post: postId}, {'user': 1});
      if(!likes) return notFound(req, res);
      res.json(likes);
    } catch (error) {
      internalError(error, req, res, next);
    }
} 

async function getLikesForUser(req, res) { //✅
    try {
      let likeExists = await Like.exists({post:req.params.postid} , {user: res.params.username});
      likeExists ? res.json(true) : res.json(false);
    } catch (error) {
      internalError(error, req, res, next);
    }
}

async function createLike(req, res) { // ✅
    let post = Post.findById(req.params.postid);
    let like = new Like( { user: req.params.username, post: post.id } );
    try {
        await like.save();
        // it worked!  OK to increment the count
        await Post.updateOne({ id: post.id }, { $inc: { likeCount: 1 } });
        res.json(true);
    }
    catch (error) {
        if (err.name === "MongoServerError" && err.code === 11000) {
            // everything's OK; it just already existed (so we don't increment)
        }
        else {
            // Uh-oh... something more sinister happened
            internalError(error, req, res, next);
        }
    }
}

async function deleteLike(req, res) {
  try {
    let post = await Post.findById(req.params.postid);
    let like = await Like.findOne({ post: post.id }, { user: req.params.username });
  
    let { deletedCount } = await Like.deleteOne({ id: like.id });
  
    if (deletedCount > 0) {
        // it worked!  OK to decrement the count
        await Post.updateOne({ _id: post.id }, { $inc: { likeCount: -1 } })
    }
    res.json(false);
  } catch(error) {
    internalError(error, req, res, next);
  }
}

async function deletePosts(req, res) {
  try {
    const posts = await Post.find().deleteMany();
    res.json(posts);
  } catch (error) {
    internalError(error);
  }
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