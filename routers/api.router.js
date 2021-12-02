const express = require("express");
const commentsRouter = require("./comments.router");
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");
const { getAPI } = require("../controllers/api.controller");

const apiRouter = express.Router();


apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route('/').get(getAPI)
module.exports = apiRouter;
