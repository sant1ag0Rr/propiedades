const jwt = require("jsonwebtoken");
const env = require("../../infrastructure/config/env");
const HttpError = require("../../domain/errors/HttpError");

const verifyToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Token no enviado o formato invalido"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return next(new HttpError(401, "Token invalido o expirado"));
  }
};

module.exports = verifyToken;
