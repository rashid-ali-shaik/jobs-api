const errorMiddleware = (err, req, res, next) => {
  const error = {
    msg: err.message || "something went wrong",
    status: err.statusCode || 500,
  };

  res.status(error.status).json({ msg: error.msg });
};
module.exports = errorMiddleware;
