const { Router } = require("express");
const propertyController = require("../controllers/PropertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const asyncHandler = require("../utils/asyncHandler");
const {
  idParamSchema,
  propertyBodySchema,
  propertyQuerySchema,
} = require("../schemas/propertySchemas");

const router = Router();

router.get("/", validate(propertyQuerySchema, "query"), asyncHandler(propertyController.getProperties.bind(propertyController)));
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(propertyController.getPropertyById.bind(propertyController))
);
router.post(
  "/",
  authMiddleware,
  validate(propertyBodySchema),
  asyncHandler(propertyController.createProperty.bind(propertyController))
);
router.put(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  validate(propertyBodySchema),
  asyncHandler(propertyController.updateProperty.bind(propertyController))
);
router.delete(
  "/:id",
  authMiddleware,
  validate(idParamSchema, "params"),
  asyncHandler(propertyController.deleteProperty.bind(propertyController))
);

module.exports = router;
