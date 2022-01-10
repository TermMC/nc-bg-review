const express = require("express");
const cors = require("cors");
const {
  handleCustomErrors,
  handle500Error,
  handleSQLerrors,
} = require("./error_handlers/error");

const apiRouter = require("./routers/api.router");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleSQLerrors);
app.use(handle500Error);

module.exports = app;
