import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export default class OAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { oauthToken } = req.query
    if (!oauthToken) {
      throw new HttpException(
        "Missing oauthToken.",
        HttpStatus.BAD_REQUEST
      )
    }
    req.body.oauthToken = oauthToken
    next();
  }
}