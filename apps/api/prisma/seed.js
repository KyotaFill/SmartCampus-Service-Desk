import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const roles = [
  { name: "STUDENT", description: "Sinh viên gửi và theo dõi yêu cầu hỗ trợ" },
  { name: "STAFF", description: "Nhân viên tiếp nhận và xử lý yêu cầu hỗ trợ" },
  { name: "ADMIN", description: "Quản trị người dùng, vai trò, category và ticket" },
];

try {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
} finally {
  await prisma.$disconnect();
}
