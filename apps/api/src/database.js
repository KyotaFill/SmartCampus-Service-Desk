import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL là bắt buộc');
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
