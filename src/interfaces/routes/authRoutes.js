const { Router } = require("express");
const authController = require("../controllers/AuthController");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../schemas/authSchemas");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(authController.login.bind(authController)));

module.exports = router;
