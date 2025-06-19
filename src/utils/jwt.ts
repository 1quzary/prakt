import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../configs/secrets'

interface TokenPayload {
  userId: number | string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}
