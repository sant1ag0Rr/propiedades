const { Prisma } = require("@prisma/client");
const prisma = require("../../infrastructure/db/prismaClient");
const HttpError = require("../../domain/errors/HttpError");

class PropertyService {
  formatProperty(property) {
    return {
      ...property,
      price: Number(property.price),
    };
  }

  buildFilters({ location, minPrice, maxPrice }) {
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
  }

  async findAll(query) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const where = this.buildFilters(query);

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
      data: properties.map(this.formatProperty),
      total,
      page,
      limit,
    };
  }

  async findById(id) {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      throw new HttpError(404, "Propiedad no encontrada");
    }

    return this.formatProperty(property);
  }

  async create(data) {
    const property = await prisma.property.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
    });

    return this.formatProperty(property);
  }

  async update(id, data) {
    await this.findById(id);

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
    });

    return this.formatProperty(property);
  }

  async remove(id) {
    await this.findById(id);
    await prisma.property.delete({ where: { id } });
  }
}

module.exports = new PropertyService();
