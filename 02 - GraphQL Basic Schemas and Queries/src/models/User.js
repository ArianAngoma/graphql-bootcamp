const {Schema, model} = require('mongoose');

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

module.exports = model('User', UserSchema);