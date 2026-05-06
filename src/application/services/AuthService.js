const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../../infrastructure/repositories/UserRepository");
const env = require("../../infrastructure/config/env");
const HttpError = require("../../domain/errors/HttpError");

class AuthService {
  async register({ email, password }) {
    const existing = await userRepository.findByEmail(email);

    if (existing) {
      throw new HttpError(409, "El email ya esta registrado");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: passwordHash });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: "2h" }
    );

    return token;
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

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
