const express = require("express");
const commentsRouter = require("./comments.router");
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");

const apiRouter = express.Router();

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
