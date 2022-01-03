const {Schema, model} = require('mongoose');

const Post = require('./Post');
const Comment = require('./Comment');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    age: {
        type: Number
    }
});

UserSchema.methods.toJSON = function () {
    const {__v, _id, ...user} = this.toObject();
    user.id = _id;
    return user;
}

/* Eliminar documentos relacionados */
UserSchema.post('findOneAndDelete', async function (doc) {
    // console.log(doc._id);
    await Post.deleteMany({author: doc._id}).exec();
});

/* Eliminar documentos relacionados */
UserSchema.post('findOneAndDelete', async function (doc) {
    // console.log(doc._id);
    await Comment.deleteMany({author: doc._id}).exec();
});

module.exports = model('User', UserSchema);