const {Schema, model} = require('mongoose');

/* Importaciones propias */
const Comment = require('./Comment');

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

PostSchema.methods.toJSON = function () {
    const {__v, _id, ...post} = this.toObject();
    post.id = _id;
    return post;
}

/* Eliminar documentos relacionados */
PostSchema.pre('findOneAndDelete', async function (next) {
    const {_id} = this.getFilter();
    // console.log(_id);
    await Comment.deleteMany({post: _id}).exec();
    next();
});

module.exports = model('Post', PostSchema);