import { PrismaClient } from "@prisma/client";

const seedClient = new PrismaClient(); // ✅ renamed so no conflict

async function main() {
  const count = await seedClient.message.count();
  if (count === 0) {
    await seedClient.message.createMany({
      data: [
        { content: "Welcome to the channel!", author: "Admin" },
        { content: "Updates will appear here.", author: "System" },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await seedClient.$disconnect();
  });
