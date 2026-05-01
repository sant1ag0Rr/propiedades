const HttpError = require("../../domain/errors/HttpError");

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    error: "Error interno del servidor",
  });
};

module.exports = errorMiddleware;
