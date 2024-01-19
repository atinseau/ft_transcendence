import { Body, Controller, Get, HttpException, HttpStatus, Query, Req, Res } from "@nestjs/common";
import FortyTwoService from "./fortytwo.service";
import AuthService from "src/auth/auth.service";
import { Response } from "express";
import TypedError from "src/errors/TypedError";


@Controller('42')
export default class FortyTwoController {

  constructor(
    private fortyTwoService: FortyTwoService,
    private authService: AuthService,
  ) { }

  @Get('oauth')
  async oauth() {
    return {
      url: this.fortyTwoService.createAuthorizationUrl()
    }
  }


  @Get('oauth/callback')
  async oauthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query("code") code: string
  ) {
    // @ts-ignore
    const redirectUrl = process.env.NEXT_PUBLIC_FRONT_URL || req.headers['referer'] as string || null
    if (!redirectUrl) {
      throw new Error("NEXT_PUBLIC_FRONT_URL is not defined, something is wrong with the environment variables.")
    }

    try {
      const token = await this.fortyTwoService.getToken(code)
      const user = await this.fortyTwoService.findOrCreateUser(token)
      const session = await this.authService.createSession(user.id)

      res.redirect(process.env.NEXT_PUBLIC_FRONT_URL + "?accessToken=" + session.accessToken + "&refreshToken=" + session.refreshToken + "&oauthToken=" + token.access_token)
    } catch (error) {
      console.log(error?.message || 'Something went wrong with the 42 oauth callback')
      res.redirect(redirectUrl + "?error=Something went wrong with the 42 oauth callback")
    }
  }

  @Get('me')
  async me(
    @Body('oauthToken') oauthToken: string
  ) {
    try {
      const fortyTwoUser = await this.fortyTwoService.me(
        oauthToken,
        5000
      )
      return fortyTwoUser
    } catch (e) {
      throw new HttpException(
        e.message,
        HttpStatus.FORBIDDEN
      )
    }
  }

}