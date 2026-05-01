const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../config/env");
const HttpError = require("../utils/httpError");

const login = async ({ email, password }) => {
  const isEmailValid = email === env.auth.email;
  const isPasswordValid = await bcrypt.compare(password, await bcrypt.hash(env.auth.password, 10));

  if (!isEmailValid || !isPasswordValid) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  return jwt.sign({ email, role: "admin" }, env.jwtSecret, { expiresIn: "2h" });
};

module.exports = {
  login,
};
