import { Router } from 'express';
import { AppError } from '../errors.js';
import { signAccessToken, verifyAccessToken } from './jwt.js';
import { hashPassword, verifyPassword } from './password.js';
import { validateLogin, validateRegister } from './validation.js';

// Dùng cùng một phép tính scrypt khi email không tồn tại để giảm khác biệt thời gian phản hồi.
const DUMMY_PASSWORD_HASH = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role.name,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}

function isUniqueEmailError(error) {
  return error?.code === 'P2002';
}

export function createAuthRouter({ authRepository, jwtSecret, jwtExpiresIn }) {
  const router = Router();

  router.post('/register', async (request, response) => {
    const input = validateRegister(request.body);
    const existingUser = await authRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Email đã được đăng ký');
    }

    const passwordHash = await hashPassword(input.password);

    try {
      const user = await authRepository.createStudent({ ...input, passwordHash });
      return response.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (isUniqueEmailError(error)) {
        throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Email đã được đăng ký');
      }
      throw error;
    }
  });

  router.post('/login', async (request, response) => {
    const input = validateLogin(request.body);
    const user = await authRepository.findByEmail(input.email);
    const passwordMatches = await verifyPassword(
      input.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH
    );

    if (!user || !passwordMatches) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không đúng');
    }
    if (!user.isActive) {
      throw new AppError(403, 'ACCOUNT_INACTIVE', 'Tài khoản đã bị vô hiệu hóa');
    }

    const accessToken = signAccessToken(user, jwtSecret, jwtExpiresIn);
    return response.json({
      token: accessToken.token,
      tokenType: 'Bearer',
      expiresIn: accessToken.expiresIn,
      user: publicUser(user)
    });
  });

  router.get('/me', async (request, response) => {
    const authorization = request.get('authorization') ?? '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError(401, 'UNAUTHORIZED', 'Cần cung cấp Bearer token');
    }

    const payload = verifyAccessToken(token, jwtSecret);
    const user = await authRepository.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new AppError(401, 'UNAUTHORIZED', 'Phiên đăng nhập không còn hợp lệ');
    }

    return response.json({ user: publicUser(user) });
  });

  return router;
}
