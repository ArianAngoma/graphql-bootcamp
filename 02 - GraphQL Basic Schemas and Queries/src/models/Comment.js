const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

CommentSchema.methods.toJSON = function () {
    const {__v, _id, ...comment} = this.toObject();
    comment.id = _id;
    return comment;
}

module.exports = model('Comment', CommentSchema);