const express = require("express");
const {
  getReview,
  patchReview,
  getReviews,
} = require("../controllers/reviews.controller");
const reviews = require("../db/data/test-data/reviews");

const reviewsRouter = express.Router();

reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

reviewsRouter.route("/").get(getReviews);

module.exports = reviewsRouter;
