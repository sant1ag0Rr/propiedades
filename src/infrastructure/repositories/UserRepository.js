const prisma = require("../db/prismaClient");

class UserRepository {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data) {
    return prisma.user.create({ data });
  }
}

module.exports = new UserRepository();
