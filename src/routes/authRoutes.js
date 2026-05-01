const { Router } = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const { loginSchema } = require("../schemas/authSchemas");

const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(authController.login));

module.exports = router;
