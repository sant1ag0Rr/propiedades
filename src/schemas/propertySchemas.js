const { z } = require("zod");

const idParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

const propertyBodySchema = z.object({
  title: z.string().trim().min(1, "El titulo es requerido"),
  price: z.coerce.number().positive("El precio debe ser mayor que cero"),
  location: z.string().trim().min(1, "La ubicacion es requerida"),
  available: z.boolean({
    error: "El campo available debe ser boolean",
  }),
});

const propertyQuerySchema = z
  .object({
    location: z.string().trim().min(1).optional(),
    minPrice: z.coerce.number().nonnegative("minPrice debe ser positivo").optional(),
    maxPrice: z.coerce.number().nonnegative("maxPrice debe ser positivo").optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  .refine(
    (query) =>
      query.minPrice === undefined ||
      query.maxPrice === undefined ||
      query.minPrice <= query.maxPrice,
    {
      message: "minPrice no puede ser mayor que maxPrice",
      path: ["minPrice"],
    }
  );

module.exports = {
  idParamSchema,
  propertyBodySchema,
  propertyQuerySchema,
};
