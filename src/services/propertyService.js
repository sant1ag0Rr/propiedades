const { Prisma } = require("@prisma/client");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

const formatProperty = (property) => ({
  ...property,
  price: Number(property.price),
});

const buildFilters = ({ location, minPrice, maxPrice }) => {
  const where = {};

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = new Prisma.Decimal(minPrice);
    }

    if (maxPrice !== undefined) {
      where.price.lte = new Prisma.Decimal(maxPrice);
    }
  }

  return where;
};

const findAll = async (query) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;
  const where = buildFilters(query);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data: properties.map(formatProperty),
    total,
    page,
    limit,
  };
};

const findById = async (id) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new HttpError(404, "Propiedad no encontrada");
  }

  return formatProperty(property);
};

const create = async (data) => {
  const property = await prisma.property.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
    },
  });

  return formatProperty(property);
};

const update = async (id, data) => {
  await findById(id);

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
    },
  });

  return formatProperty(property);
};

const remove = async (id) => {
  await findById(id);
  await prisma.property.delete({ where: { id } });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
