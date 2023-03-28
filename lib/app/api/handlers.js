const { Post } = require('../../models/post');
const { Like } = require("../../models/like");
const logger = require('../../logger');

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
    next(error);
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
    next(error);
  }
}

async function readAllQuestions(req, res, next) { // ✅
    try {
      const questions = await Post.find( { reference: undefined } ).select({
        contents: 0
      });
      res.json(questions);
    } catch (error) {
      next(error);
    }
}

async function createQuestion(req, res, next) { // ✅
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
      next(error);
    }
};

async function readQuestion(req, res, next) { // ✅
  try {
    const questionId = res.locals.question.id;
    const question = await Post.findById( { id: questionId } );
    res.json(question);
  } catch (error) {
    next(error);
  }
};

async function updateQuestion(req, res, next) {  // ✅
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
    next(error);
  }
};

async function readAnswersForQuestion(req, res, next) { // ✅
  try {
    let questionId = res.locals.question.id;
    let answers = await Post.find({reference:questionId}).select({
        reference: 0
    });
    res.json(answers);
  } catch (error) {
    next(error);
  }
}

async function createAnswerForQuestion(req, res, next) {  // ✅
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
      next(error);
    }
};

async function readAnswer(req, res, next) { // ✅
    try {
      let answerId = res.locals.answer.id;
      let answer = await Post.findById(answerId);
      res.json(answer);
    } catch (error) {
      next(error);
    }
};

async function updateAnswer(req, res, next) {  // ✅
    try {
      let answerId = res.locals.answer.id;
      let answer = await Post.findById(answerId);
  
      answer.contents = req.body.contents;
      answer.author = req.body.author;
      answer.edited = Date.now();
  
      await answer.save();
      res.json(answer);
    } catch (error) {
      next(error);
    }
};

async function getLikesForPost(req, res, next) { // ✅
    try {
      let postId = req.params.postid;
      const likes = await Like.find({post: postId}, {'user': 1});
      if(!likes) return notFound(req, res, next);
      res.json(likes);
    } catch (error) {
      next(error);
    }
} 

async function getLikesForUser(req, res, next) { //✅
    try {
      let likeExists = await Like.exists({post:req.params.postid} , {user: res.params.username});
      likeExists ? res.json(true) : res.json(false);
    } catch (error) {
      next(error);
    }
}

async function createLike(req, res, next) { // ✅
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
            next(error);
        }
    }
}

async function deleteLike(req, res, next) {
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
    next(error);
  }
}

async function deletePosts(req, res, next) {
  try {
    const posts = await Post.find().deleteMany();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

module.exports = {
    notFound,
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