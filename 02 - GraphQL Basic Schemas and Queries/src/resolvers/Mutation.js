const bcrypt = require('bcryptjs');

/* Impotaciones propias */
const {generateJWT} = require('../helpers/jwt');
const {validateJWT} = require('../middlewares/validate-jwt');

const Mutation = {
  async createUser(parent, {data}, {models}, info) {
    if (data.password.length < 6) {
      throw new Error('Password must be 6 characters or longer');
    }

    /* Ver si el email ya esta en uso */
    const emailTaken = await models.User.findOne({email: data.email});

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = new models.User({...data});

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(data.password, salt);

    await user.save();

    /* Generar token */
    const token = await generateJWT(user.id);

    return {
      user,
      token,
    };
  },
  async login(parent, {data}, {models}, info) {
    const user = await models.User.findOne({email: data.email});
    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compareSync(data.password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }

    /* Generar token */
    const token = await generateJWT(user.id);

    return {
      user,
      token,
    };
  },
  async deleteUser(parent, args, {
    request,
    models,
  }, info) {
    const user = await validateJWT(request);

    return models.User.findByIdAndDelete(user.id);
  },
  async updateUser(parent, {
    id,
    data,
  }, {
    request,
    models,
  }, info) {
    const user = await validateJWT(request);

    const {
      password,
      ...dataUser
    } = data;

    const emailTaken = await models.User.findOne({email: dataUser.email});

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    if (password) {
      const salt = bcrypt.genSaltSync();
      dataUser.password = bcrypt.hashSync(password, salt);
    }

    return models.User.findByIdAndUpdate(user.id, dataUser, {new: true});
  },
  async createPost(parent, {data}, {
    pubsub,
    request,
    models,
  }, info) {
    const user = await validateJWT(request);

    const post = new models.Post({
      ...data,
      author: user.id,
    });
    await post.save();

    if (data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },
  async deletePost(parent, {id}, {
    pubsub,
    models,
  }, info) {
    const post = await models.Post.findByIdAndDelete(id);

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }

    return post;
  },
  async updatePost(parent, {
    id,
    data,
  }, {
    pubsub,
    models,
  }, info) {
    const post = await models.Post.findByIdAndUpdate(id, data, {new: true});

    if (!post) {
      throw new Error('Post not found');
    }

    pubsub.publish('post', {
      post: {
        mutation: 'UPDATED',
        data: post,
      },
    });

    return post;
  },
  async createComment(parent, {data}, {
    pubsub,
    request,
    models,
  }, info) {
    const user = await validateJWT(request);
    const postExists = await models.Post.findOne({
      _id: data.post,
      published: true,
    });

    if (!user || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = new models.Comment({
      ...data,
      author: user.id,
    });
    await comment.save();

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });

    return comment;
  },
  async deleteComment(parent, {id}, {
    pubsub,
    models,
  }, info) {
    const comment = await models.Comment.findByIdAndDelete(id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment,
      },
    });

    return comment;
  },
  async updateComment(parent, {
    id,
    data,
  }, {
    pubsub,
    models,
  }, info) {
    const comment = await models.Comment.findByIdAndUpdate(id, data, {new: true});

    if (!comment) {
      throw new Error('Comment not found');
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });

    return comment;
  },
};

module.exports = Mutation;
