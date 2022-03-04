/* Importaciones propias */
const {validateJWT} = require('../middlewares/validate-jwt');

const Query = {
  async users(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    const {
      field,
      sort,
    } = orderBy;
    const opArgs = {};

    if (query) {
      opArgs.name = {
        $regex: query,
        $options: 'i',
      };
    }

    return models.User.find(opArgs)
        .skip(skip)
        .limit(limit)
        .sort({[field]: sort});
  },
  async posts(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    const {
      field,
      sort,
    } = orderBy;
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

    return models.Post.find(opArgs)
        .skip(skip)
        .limit(limit)
        .sort({[field]: sort});
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
    const {
      field,
      sort,
    } = orderBy;
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

    return models.Post.find(opArgs)
        .skip(skip)
        .limit(limit)
        .sort({[field]: sort});
  },
  async comments(parent, {
    query,
    skip,
    limit,
    orderBy,
  }, {models}, info) {
    const {
      field,
      sort,
    } = orderBy;
    const opArgs = {};

    if (query) {
      opArgs.text = {
        $regex: query,
        $options: 'i',
      };
    }

    return models.Comment.find(opArgs)
        .skip(skip)
        .limit(limit)
        .sort({[field]: sort});
  },
};

module.exports = Query;
