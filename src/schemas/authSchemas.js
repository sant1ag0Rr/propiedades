const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email("El email no es valido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

module.exports = {
  loginSchema,
};
