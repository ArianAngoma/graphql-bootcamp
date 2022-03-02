/* Importaciones propias */
const {validateJWT} = require('../middlewares/validate-jwt');

const Query = {
  async users(parent, {
    query,
    skip,
    limit,
  }, {models}, info) {
    const opArgs = {};

    if (query) {
      opArgs.name = {
        $regex: query,
        $options: 'i',
      };
    }

    return models.User.find(opArgs).skip(skip).limit(limit);
  },
  async posts(parent, {
    query,
    skip,
    limit,
  }, {models}, info) {
    const opArgs = {};

    if (query) {
      opArgs.$or = [{
        title: {
          $regex: query,
          $options: 'i',
        },
      }, {
        body: {
          $regex: query,
          $options: 'i',
        },
      }];
    }

    return models.Post.find(opArgs).skip(skip).limit(limit);
  },
  async post(parent, {id}, {models}, info) {
    return models.Post.findById(id);
  },
  async myPosts(parent, {query}, {
    request,
    models,
    skip,
    limit,
  }, info) {
    const user = await validateJWT(request);

    const opArgs = {
      author: user.id,
    };

    if (query) {
      opArgs.$or = [{
        title: {
          $regex: query,
          $options: 'i',
        },
      }, {
        body: {
          $regex: query,
          $options: 'i',
        },
      }];
    }

    return models.Post.find(opArgs).skip(skip).limit(limit);
  },
  async comments(parent, {
    query,
    skip,
    limit,
  }, {models}, info) {
    const opArgs = {};

    if (query) {
      opArgs.text = {
        $regex: query,
        $options: 'i',
      };
    }

    return models.Comment.find(opArgs).skip(skip).limit(limit);
  },
};

module.exports = Query;
