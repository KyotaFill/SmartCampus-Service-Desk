import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const FORMAT = 'scrypt';

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `${FORMAT}$${salt}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const [format, salt, hash] = String(storedHash).split('$');

  if (format !== FORMAT || !salt || !hash) {
    return false;
  }

  const storedKey = Buffer.from(hash, 'hex');
  if (storedKey.length !== KEY_LENGTH) {
    return false;
  }

  const suppliedKey = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(storedKey, suppliedKey);
}
