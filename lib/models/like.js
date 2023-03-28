const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: String,
        match: /^[a-zA-Z][a-zA-Z\d]*$/,
        minlength: 4,
        maxlength: 20,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    toJSON: {
        transform: (doc, obj, options) => {
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
            return obj;
        }
    }
})

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };