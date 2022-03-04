/* Importaciones propias */
const {validateJWT} = require('../middlewares/validate-jwt');
const {filterQuery} = require('../utils/db');

const Query = {
  async users(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) {
      opArgs = filterQuery('User', query);
    }

    return (orderBy) ?
      models.User.find(opArgs)
          .skip(skip)
          .limit(limit)
          .sort({[orderBy.field]: orderBy.sort}) :
      models.User.find(opArgs)
          .skip(skip)
          .limit(limit);
  },
  async posts(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) {
      opArgs = filterQuery('Post', query);
    }

    return (orderBy) ?
      models.Post.find(opArgs)
          .skip(skip)
          .limit(limit)
          .sort({[orderBy.field]: orderBy.sort}) :
      models.Post.find(opArgs)
          .skip(skip)
          .limit(limit);
  },
  async post(parent, {id}, {models}, info) {
    return models.Post.findById(id);
  },
  async myPosts(parent, {query}, {
    request,
    models,
    skip,
    limit,
    orderBy,
  }, info) {
    const user = await validateJWT(request);

    let opArgs = {};

    if (query) {
      opArgs = filterQuery('Post', query);
    }
    opArgs.author = user.id;

    return (orderBy) ?
      models.Post.find(opArgs)
          .skip(skip)
          .limit(limit)
          .sort({[orderBy.field]: orderBy.sort}) :
      models.Post.find(opArgs)
          .skip(skip)
          .limit(limit);
  },
  async comments(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) {
      opArgs = filterQuery('Comment', query);
    }

    return (orderBy) ?
      models.Comment.find(opArgs)
          .skip(skip)
          .limit(limit)
          .sort({[orderBy.field]: orderBy.sort}) :
      models.Comment.find(opArgs)
          .skip(skip)
          .limit(limit);
  },
};

module.exports = Query;
