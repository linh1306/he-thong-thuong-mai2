import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export function createToken(tokenBody: object): string {
  return jwt.sign(tokenBody, process.env.KEY_TOKEN!);
}
export function verifyToken(): JwtPayload {
  const cookieStore = cookies();
  try {
    const token = cookieStore.get('token')?.value

    if (!token) {
      return { statusToken: false, payloadToken: {}, message: 'Bạn chưa đăng nhập', error: 'not login' }
    }

    const payload = jwt.verify(token, process.env.KEY_TOKEN!)
    return { statusToken: true, payloadToken: payload }
  } catch (err) {
    return { statusToken: false, payloadToken: {}, message: 'token không hợp lệ' }
  }
}

