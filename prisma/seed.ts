const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.message.count();
  if (count === 0) {
    await prisma.message.createMany({
      data: [
        { content: "Welcome to the channel!", author: "Admin" },
        { content: "Updates will appear here.", author: "System" }
      ]
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
