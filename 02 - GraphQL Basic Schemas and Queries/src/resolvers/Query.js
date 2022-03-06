/* Importaciones propias */
const {validateJWT} = require('../middlewares/validate-jwt');
const {
  filterQuery,
  findQuery,
} = require('../utils/db');

const Query = {
  async users(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) opArgs = filterQuery('User', query);

    const params = {
      model: models.User,
      opArgs,
      skip,
      limit,
      orderBy,
    };

    return findQuery(params);
  },
  async posts(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) opArgs = filterQuery('Post', query);

    const params = {
      model: models.Post,
      opArgs,
      skip,
      limit,
      orderBy,
    };

    return findQuery(params);
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

    if (query) opArgs = filterQuery('Post', query);
    opArgs.author = user.id;

    const params = {
      model: models.Post,
      opArgs,
      skip,
      limit,
      orderBy,
    };

    return findQuery(params);
  },
  async comments(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    let opArgs = {};

    if (query) opArgs = filterQuery('Comment', query);

    const params = {
      model: models.Comment,
      opArgs,
      skip,
      limit,
      orderBy,
    };

    return findQuery(params);
  },
};

module.exports = Query;
