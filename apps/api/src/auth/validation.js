import { AppError } from '../errors.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(details) {
  throw new AppError(400, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ', details);
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function validateRegister(body) {
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const email = normalizeEmail(body?.email);
  const password = body?.password;
  const details = [];

  if (fullName.length < 2 || fullName.length > 150) {
    details.push({ field: 'fullName', message: 'Họ tên phải có từ 2 đến 150 ký tự' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 255) {
    details.push({ field: 'email', message: 'Email không hợp lệ' });
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    details.push({ field: 'password', message: 'Mật khẩu phải có từ 8 đến 128 ký tự' });
  }

  if (details.length) validationError(details);
  return { fullName, email, password };
}

export function validateLogin(body) {
  const email = normalizeEmail(body?.email);
  const password = body?.password;
  const details = [];

  if (!EMAIL_PATTERN.test(email) || email.length > 255) {
    details.push({ field: 'email', message: 'Email không hợp lệ' });
  }
  if (typeof password !== 'string' || password.length === 0 || password.length > 128) {
    details.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
  }

  if (details.length) validationError(details);
  return { email, password };
}
