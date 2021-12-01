const express = require("express");
const { getComments } = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter.route("/").get(getComments);

module.exports = commentsRouter;
