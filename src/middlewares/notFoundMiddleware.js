const HttpError = require("../utils/httpError");

const notFoundMiddleware = (req, _res, next) => {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;
