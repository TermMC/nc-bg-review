const {
  fetchComments,
  asyncCreateComment,
  removeComment,
  asyncRemoveComment,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  const review_id = req.originalUrl.split("/")[3];
  fetchComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const review_id = req.originalUrl.split("/")[3];
  const { body, username: author } = req.body;
  asyncCreateComment(review_id, body, author)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};