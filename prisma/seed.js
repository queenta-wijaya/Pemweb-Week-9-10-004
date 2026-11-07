const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { id: 1 },
    update: { name: 'Buku', price: 15000 },
    create: { id: 1, name: 'Buku', price: 15000 }
  });

  await prisma.product.upsert({
    where: { id: 2 },
    update: { name: 'Pulpen', price: 5000 },
    create: { id: 2, name: 'Pulpen', price: 5000 }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
