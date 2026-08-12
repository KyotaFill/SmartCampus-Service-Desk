import { createApp } from './app.js';
import { createPrismaClient } from './database.js';
import { createAuthRepository } from './auth/repository.js';

const port = Number(process.env.PORT ?? 3000);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET phải có ít nhất 32 ký tự');
}

const prisma = createPrismaClient();
const app = createApp({
  authRepository: createAuthRepository(prisma),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN
});

app.listen(port, () => {
  console.log(`SmartCampus API đang chạy tại http://localhost:${port}`);
});
