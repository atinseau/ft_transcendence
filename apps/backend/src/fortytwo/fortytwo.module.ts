import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import OAuthMiddleware from "src/oauth/oauth.middleware";
import FortyTwoController from "./fortytwo.controller";
import AuthMiddleware from "src/auth/auth.middleware";
import FortyTwoService from "./fortytwo.service";
import UserService from "src/user/user.service";
import DatabaseService from "src/database/database.service";
import AuthService from "src/auth/auth.service";
import EmailService from "src/email/email.service";




@Module({
  controllers: [
    FortyTwoController,
  ],
  providers: [
    FortyTwoService,
    UserService,
    AuthService,
    DatabaseService,
    EmailService,
  ]
})
export default class FortyTwoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        OAuthMiddleware
      )
      .exclude(
        { path: '42/oauth', method: RequestMethod.ALL },
        { path: '42/oauth/callback', method: RequestMethod.ALL}
      )
      .forRoutes(FortyTwoController)
  }
}