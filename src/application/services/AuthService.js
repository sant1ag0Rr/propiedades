const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../infrastructure/db/prismaClient");
const env = require("../../infrastructure/config/env");
const HttpError = require("../../domain/errors/HttpError");

class AuthService {
  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpError(401, "Credenciales invalidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError(401, "Credenciales invalidas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: "2h" }
    );

    return token;
  }
}

module.exports = new AuthService();
