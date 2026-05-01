const jwt = require("jsonwebtoken");
const env = require("../config/env");
const HttpError = require("../utils/httpError");

const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Token no enviado"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return next(new HttpError(401, "Token invalido o expirado"));
  }
};

module.exports = authMiddleware;
