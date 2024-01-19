import { verify, sign } from 'jsonwebtoken'
import { createHash } from 'crypto'

export const createToken = (
  payload: Record<string, any>,
  expiresIn: string | number
) => {
  return sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn
  })
}

const generateTokens = (
  userId: string,
  refreshTokenId: string,
  createSessionOptions?: CreateSessionOptions
) => {
  const payload = {
    id: userId
  }

  const {
    accessTokenExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '5m',
    refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  } = createSessionOptions || {}

  return {
    accessToken: createToken(payload, accessTokenExpiresIn),
    refreshToken: createToken({
      jti: refreshTokenId,
      ...payload
    }, refreshTokenExpiresIn)
  }
}

const hashToken = (token: string) => {
  return createHash('sha512').update(token).digest('hex');
}

const verifyToken = <T = true>(token: string) => {
  try {
    return verify(token, process.env.JWT_SECRET || 'secret') as T
  } catch (_) {
    return null
  }
}


export {
  generateTokens,
  verifyToken,
  hashToken
}