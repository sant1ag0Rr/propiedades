const { Router } = require("express");
const authRoutes = require("./authRoutes");
const propertyRoutes = require("./propertyRoutes");

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "v1" });
});

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);

module.exports = router;
