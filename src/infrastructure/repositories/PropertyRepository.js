const prisma = require("../db/prismaClient");

class PropertyRepository {
  findAll(where, skip, take) {
    return prisma.property.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  count(where) {
    return prisma.property.count({ where });
  }

  findById(id) {
    return prisma.property.findUnique({ where: { id } });
  }

  create(data) {
    return prisma.property.create({ data });
  }

  update(id, data) {
    return prisma.property.update({ where: { id }, data });
  }

  delete(id) {
    return prisma.property.delete({ where: { id } });
  }
}

module.exports = new PropertyRepository();
