const models = {
  User: ['name'],
  Post: ['title', 'body'],
  Comment: ['text'],
};

const filterQuery = (model, query) => {
  const fields = models[model];

  if (fields.length > 1) {
    return ({
      $or: fields.map((field) => ({
        [field]: {
          $regex: query,
          $options: 'i',
        },
      })),
    });
  } else {
    return ({
      [fields[0]]: {
        $regex: query,
        $options: 'i',
      },
    });
  }
};

module.exports = {
  filterQuery,
};
