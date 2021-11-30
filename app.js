const express = require("express");
const {
  handle400BadRequest,
  handleCustomErrors,
  handle500Error,
} = require("./error_handlers/error");
const apiRouter = require("./routers/api.router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400BadRequest);
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;
