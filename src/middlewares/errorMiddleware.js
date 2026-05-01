const { Prisma } = require("@prisma/client");

const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "Error en la base de datos",
      code: error.code,
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Error interno del servidor" : error.message,
    details: error.details || undefined,
  });
};

module.exports = errorMiddleware;
