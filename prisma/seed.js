require("dotenv").config();
const { PrismaClient, Prisma } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const adminUser = {
  email: "admin@test.com",
  password: "123456",
};

const properties = [
  {
    title: "Apartamento moderno en El Poblado",
    price: new Prisma.Decimal(350000000),
    location: "El Poblado, Medellin",
    available: true,
  },
  {
    title: "Casa familiar en Envigado",
    price: new Prisma.Decimal(520000000),
    location: "Envigado",
    available: true,
  },
  {
    title: "Oficina en Laureles",
    price: new Prisma.Decimal(280000000),
    location: "Laureles, Medellin",
    available: false,
  },
  {
    title: "Penthouse con vista al rio",
    price: new Prisma.Decimal(980000000),
    location: "El Centro, Medellin",
    available: true,
  },
  {
    title: "Local comercial en Bello",
    price: new Prisma.Decimal(175000000),
    location: "Bello",
    available: true,
  },
  {
    title: "Casa campestre en Rionegro",
    price: new Prisma.Decimal(650000000),
    location: "Rionegro",
    available: false,
  },
  {
    title: "Apartaestudio en Sabaneta",
    price: new Prisma.Decimal(190000000),
    location: "Sabaneta",
    available: true,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(adminUser.password, 10);

  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: { email: adminUser.email, password: passwordHash },
  });

  await prisma.property.createMany({
    data: properties,
    skipDuplicates: true,
  });

  console.log("Seed ejecutado correctamente");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
