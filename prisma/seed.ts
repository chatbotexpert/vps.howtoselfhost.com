import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const db = new PrismaClient({ adapter });

async function main() {
  // Clear old plans
  await db.vpsPlan.deleteMany({});
  
  // Seed VPS plans
  const plans = [
    { name: "Cloud VPS 1", slug: "vps-1", description: "Great for testing and simple personal projects.", price: 11.00, cpu: "4 vCores", ram: "6 GB", storage: "100 GB NVMe", bandwidth: "32 TB", popular: false, sortOrder: 1 },
    { name: "Cloud VPS 2", slug: "vps-2", description: "Best balance of performance and price for most apps.", price: 21.00, cpu: "6 vCores", ram: "16 GB", storage: "400 GB NVMe", bandwidth: "32 TB", popular: true, sortOrder: 2 },
    { name: "Cloud VPS 3", slug: "vps-3", description: "For high-load databases and large traffic hubs.", price: 35.00, cpu: "8 vCores", ram: "24 GB", storage: "800 GB NVMe", bandwidth: "32 TB", popular: false, sortOrder: 3 },
    { name: "Cloud VPS 4", slug: "vps-4", description: "Maximum performance for enterprise level applications.", price: 59.00, cpu: "10 vCores", ram: "60 GB", storage: "1.6 TB NVMe", bandwidth: "32 TB", popular: false, sortOrder: 4 },
  ];

  for (const plan of plans) {
    await db.vpsPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`✅ Plan: ${plan.name}`);
  }

  // Promote first user to admin (or create one)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hashturns@gmail.com";

  let adminUser = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!adminUser) {
    const hash = await bcrypt.hash("admin123", 12);
    adminUser = await db.user.create({
      data: { email: ADMIN_EMAIL, passwordHash: hash, firstName: "Admin", lastName: "User", isAdmin: true },
    });
    console.log(`✅ Created admin user: ${ADMIN_EMAIL} / password: admin123`);
  } else {
    await db.user.update({ where: { email: ADMIN_EMAIL }, data: { isAdmin: true } });
    console.log(`✅ Promoted to admin: ${ADMIN_EMAIL}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
