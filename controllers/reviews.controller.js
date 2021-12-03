const {
  fetchReview,
  updateReview,
  fetchReviews,
  createReview,
} = require("../models/reviews.models");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  fetchReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const update_content = req.body;
  updateReview(review_id, update_content)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      console.log(reviews);
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReview = (req, res, next) => {
  const review_data = req.body;
  createReview(review_data)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
