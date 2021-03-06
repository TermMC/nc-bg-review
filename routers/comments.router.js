const express = require("express");
const {
  getComments,
  postComment,
  deleteComment,
  patchComment,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter.route("/").get(getComments).post(postComment);

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
