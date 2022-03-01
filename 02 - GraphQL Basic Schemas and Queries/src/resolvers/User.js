/* Importaciones propias */
const {validateJWT} = require('../middlewares/validate-jwt');

const User = {
  async posts(parent, args, {models}, info) {
    return models.Post.find({author: parent.id});
  },
  async comments(parent, args, {models}, info) {
    return models.Comment.find({author: parent.id});
  },
  async email(parent, args, {request}, info) {
    const user = await validateJWT(request, false);

    if (user && user.id === parent.id) {
      return parent.email;
    }

    return null;
  },
};

module.exports = User;
