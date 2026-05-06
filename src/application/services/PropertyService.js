const { Prisma } = require("@prisma/client");
const propertyRepository = require("../../infrastructure/repositories/PropertyRepository");
const Property = require("../../domain/entities/Property");
const HttpError = require("../../domain/errors/HttpError");

class PropertyService {
  buildFilters({ location, minPrice, maxPrice, available }) {
    const where = {};

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
    }

    if (available !== undefined) {
      where.available = available;
    }

    return where;
  }

  async findAll(query) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const where = this.buildFilters(query);

    const [records, total] = await Promise.all([
      propertyRepository.findAll(where, skip, limit),
      propertyRepository.count(where),
    ]);

    return {
      data: records.map((r) => new Property(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    const record = await propertyRepository.findById(id);

    if (!record) {
      throw new HttpError(404, "Propiedad no encontrada");
    }

    return new Property(record);
  }

  async create(data) {
    const record = await propertyRepository.create({
      ...data,
      price: new Prisma.Decimal(data.price),
    });

    return new Property(record);
  }

  async update(id, data) {
    await this.findById(id);

    const record = await propertyRepository.update(id, {
      ...data,
      price: new Prisma.Decimal(data.price),
    });

    return new Property(record);
  }

  async remove(id) {
    await this.findById(id);
    await propertyRepository.delete(id);
  }
}

module.exports = new PropertyService();
