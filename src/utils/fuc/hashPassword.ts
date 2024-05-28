import crypto from 'crypto';

export function hashPassword(value: string): string {
  try {
    const hmac = crypto.createHmac('sha256', process.env.KEY_HASH!);
    hmac.update(value);
    const combinedPassword = hmac.digest('hex');
    const hash = crypto.createHash('sha256').update(combinedPassword).digest('hex');
    return hash;
  } catch (error) {
    console.error('Error hashing password with key:', error);
    throw error;
  }
}

export function verifyPassword(password: string, value: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', process.env.KEY_HASH!);
    hmac.update(value);
    const combinedPassword = hmac.digest('hex');
    const hash = crypto.createHash('sha256').update(combinedPassword).digest('hex');
    return password === hash;
  } catch (error) {
    console.error('Error hashing password with key:', error);
    throw error;
  }
}