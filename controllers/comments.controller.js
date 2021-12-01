const { fetchComments } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  console.log("I'm in cont");
  const review_id = req.originalUrl.split("/")[3];
  console.log("review_id", review_id, "originalUrl", req.originalUrl);
  fetchComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};
