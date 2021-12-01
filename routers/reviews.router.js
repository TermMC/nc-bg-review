const express = require("express");
const {
  getReview,
  patchReview,
  getReviews,
} = require("../controllers/reviews.controller");
const commentsRouter = require("./comments.router");

const reviewsRouter = express.Router();

reviewsRouter.use("/:review_id/comments", commentsRouter);

reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

reviewsRouter.route("/").get(getReviews);

module.exports = reviewsRouter;
