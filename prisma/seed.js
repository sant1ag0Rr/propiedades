require("dotenv").config();
const { PrismaClient, Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const properties = [
  {
    title: "Apartamento en Medellin",
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
];

async function main() {
  await prisma.property.createMany({
    data: properties,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed ejecutado correctamente");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
