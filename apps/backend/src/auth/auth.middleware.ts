import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { hashToken, verifyToken } from "src/utils/token";

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from "cache-manager";

@Injectable()
export default class AuthMiddleware implements NestMiddleware {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || null;
    const payload = token ? verifyToken<{ id: string, jti: string }>(token) : null;

    if (!token || !payload || payload?.jti) {
      throw new HttpException(
        "Not authorized.",
        HttpStatus.UNAUTHORIZED
      )
    }

    const userBl = await this.cacheManager.get(payload.id + ":blacklist") as string[] | undefined
    if (userBl && userBl.includes(hashToken(token))) {
      throw new HttpException(
        "Not authorized.",
        HttpStatus.UNAUTHORIZED
      )
    }
    req.body.userId = payload.id // Add userId to req.body if token is valid
    req.body.accessToken = token // Add accessToken to req.body if token is valid
    
    next();
  }
} 