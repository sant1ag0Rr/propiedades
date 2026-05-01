const { Router } = require("express");
const propertyController = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const {
  idParamSchema,
  propertyBodySchema,
  propertyQuerySchema,
} = require("../schemas/propertySchemas");

const router = Router();

router.get("/", validate(propertyQuerySchema, "query"), asyncHandler(propertyController.getProperties));
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(propertyController.getPropertyById)
);
router.post(
  "/",
  authMiddleware,
  validate(propertyBodySchema),
  asyncHandler(propertyController.createProperty)
);
router.put(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(propertyBodySchema),
  asyncHandler(propertyController.updateProperty)
);
router.delete(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  asyncHandler(propertyController.deleteProperty)
);

module.exports = router;
