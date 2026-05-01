const HttpError = require("../../domain/errors/HttpError");

const notFoundMiddleware = (req, res, next) => {
  next(new HttpError(404, `Ruta no encontrada - ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;
