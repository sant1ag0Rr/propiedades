const authService = require("../../application/services/AuthService");

class AuthController {
  async register(req, res) {
    const token = await authService.register(req.body);
    return res.status(201).json({ token });
  }

  async login(req, res) {
    const token = await authService.login(req.body);
    return res.json({ token });
  }
}

module.exports = new AuthController();
