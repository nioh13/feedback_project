import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Функциональность" },
      { name: "Баг" },
      { name: "UI" },
      { name: "Производительность" }
    ],
    skipDuplicates: true
  });

  await prisma.status.createMany({
    data: [
      { name: "Идея" },
      { name: "Запланировано" },
      { name: "В работе" },
      { name: "Выполнено" }
    ],
    skipDuplicates: true
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
