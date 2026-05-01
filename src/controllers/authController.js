const authService = require("../services/authService");

const login = async (req, res) => {
  const token = await authService.login(req.body);
  return res.json({ token });
};

module.exports = {
  login,
};
