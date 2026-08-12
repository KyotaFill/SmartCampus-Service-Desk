import { createHmac, timingSafeEqual } from 'node:crypto';
import { AppError } from '../errors.js';

const DEFAULT_EXPIRES_IN = 3600;

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signature(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function parseExpiresIn(value) {
  const seconds = Number(value ?? DEFAULT_EXPIRES_IN);
  return Number.isInteger(seconds) && seconds > 0 ? seconds : DEFAULT_EXPIRES_IN;
}

export function signAccessToken(user, secret, expiresInValue) {
  const expiresIn = parseExpiresIn(expiresInValue);
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: user.id,
    role: user.role.name,
    iat: issuedAt,
    exp: issuedAt + expiresIn
  });
  const unsignedToken = `${header}.${payload}`;

  return {
    token: `${unsignedToken}.${signature(unsignedToken, secret)}`,
    expiresIn
  };
}

export function verifyAccessToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed token');

    const [headerPart, payloadPart, suppliedSignature] = parts;
    const unsignedToken = `${headerPart}.${payloadPart}`;
    const expected = Buffer.from(signature(unsignedToken, secret));
    const supplied = Buffer.from(suppliedSignature);

    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
      throw new Error('Invalid signature');
    }

    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (header.alg !== 'HS256' || header.typ !== 'JWT') throw new Error('Invalid header');
    if (typeof payload.sub !== 'string' || !Number.isInteger(payload.exp) || payload.exp <= now) {
      throw new Error('Expired or invalid token');
    }

    return payload;
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Token không hợp lệ hoặc đã hết hạn');
  }
}
