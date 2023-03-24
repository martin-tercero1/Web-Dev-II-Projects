const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    summary: { 
        type: String,
        trim:true,
        minlength: 10,
        maxlength:100
    },
    contents:{
        type: String,
        trim: true,
        minlength:1,
        maxlength:1000,
        required:true
    },
    reference:{
        type: mongoose.Schema.Types.ObjectId
    },
    author:{
        type:String,
        match: /^[a-zA-Z][a-zA-Z\d]*$/,
        minlength: 4,
        maxlength:20,
        required:true
    },
    likeCount:{
        type: Number,
        required: true
    },
    created:{
        type: Date,
        required: true
    },
    edited:{
        type: Date,
        required:true
    }
})

const Post= mongoose.model('Post', postSchema);
module.exports={ Post };