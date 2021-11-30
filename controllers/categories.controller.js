const { fetchCategories } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  return fetchCategories()
    .then((categories) => res.status(200).send({ categories }))
    .catch((err) => {
      next(err);
    });
};
