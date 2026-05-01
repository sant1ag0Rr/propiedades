const authService = require("../../application/services/AuthService");

class AuthController {
  async login(req, res) {
    const token = await authService.login(req.body);
    return res.json({ token });
  }
}

module.exports = new AuthController();
