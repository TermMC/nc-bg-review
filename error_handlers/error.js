exports.handleSQLerrors = (err, req, res, next) => {
  let status, msg;
  switch (err.code) {
    case "22P02":
      status = 400;
      msg = "Invalid Request";
      break;
    case "42703":
      status = 400;
      msg = "Invalid Search Term";
      break;
    case "23503":
      status = 404;
      msg = "Invalid Search Term";
      break;
  }
  if (msg && status) {
    res.status(status).send({ msg });
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
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
