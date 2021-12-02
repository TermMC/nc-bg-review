exports.handleSQLerrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
    //remember this has an OR
  } else if (err.code === "42703" || "23503") {
    res.status(400).send({ msg: "Invalid Search Term" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500Error = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
