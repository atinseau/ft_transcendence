import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { Cache } from "cache-manager";
import TypedError from "src/errors/TypedError";
import UserService from "src/user/user.service";

@Injectable()
export default class FortyTwoService {

  private _clientId = process.env.FORTYTWO_CLIENT_ID
  private _clientSecret = process.env.FORTYTWO_CLIENT_SECRET
  private _state = "a_very_long_random_string_witchmust_be_unguessable"

  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async me(oauthToken: string, expiresIn: number) {
    try {
      const cachedUser = await this.cacheManager.get<FortyTwoUser>(oauthToken)
      if (cachedUser) {
        return cachedUser
      }
      const baseUrl = "https://api.intra.42.fr/v2/me"
      const { data } = await axios.get<FortyTwoUser>(baseUrl, {
        headers: {
          Authorization: `Bearer ${oauthToken}`
        }
      })
      // expires_in is in seconds, but cacheManager expects milliseconds
      await this.cacheManager.set(oauthToken, data, expiresIn * 1000)
      return data
    } catch (e) {
      throw new TypedError({
        message: 'Unable to fetch user from 42 API',
        type: '42_USER_ERROR'
      })
    }
  }

  createAuthorizationUrl() {
    const baseUrl = "https://api.intra.42.fr/oauth/authorize"
    const redirectUrl = (process.env.NEXT_PUBLIC_CLIENT_BACKEND_URL || "http://localhost:8080") + "/42/oauth/callback"
    const redirectUri = encodeURIComponent(redirectUrl)
    const scope = "public"
    const responseType = "code"

    return [
      baseUrl,
      `?client_id=${this._clientId}`,
      `&redirect_uri=${redirectUri}`,
      `&scope=${scope}`,
      `&state=${this._state}`,
      `&response_type=${responseType}`
    ].join("")
  }

  async getToken(code: string) {
    try {
      const baseUrl = "https://api.intra.42.fr/oauth/token"
      const grantType = "authorization_code"
      const redirectUri = (process.env.NEXT_PUBLIC_CLIENT_BACKEND_URL || "http://localhost:8080") + "/42/oauth/callback"

      const body = {
        client_id: this._clientId,
        client_secret: this._clientSecret,
        state: this._state,
        grant_type: grantType,
        redirect_uri: redirectUri,
        code,
      }
      const { data } = await axios.post<FortyTwoToken>(baseUrl, body)
      return data
    } catch (error) {
      throw new TypedError({
        message: 'Unable to fetch token from 42 API',
        type: '42_TOKEN_ERROR'
      })
    }
  }

  async findOrCreateUser(token: FortyTwoToken) {
    const fortyTwoUser = await this.me(token.access_token, token.expires_in)
    let user = await this.userService.findUserByEmailOrUsername({
      email: fortyTwoUser.email,
      username: fortyTwoUser.login
    });

    if (!user) {
      user = await this.userService.createUser({
        provider: "42",
        email: fortyTwoUser.email,
        username: fortyTwoUser.login,
        avatar: fortyTwoUser.image.versions.medium,
        flag_avatar: true,
      })
    }
    return user
  }
}