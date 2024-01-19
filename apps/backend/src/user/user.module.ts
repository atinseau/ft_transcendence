import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import UserController from "./user.controller";
import AuthMiddleware from "src/auth/auth.middleware";
import DatabaseService from "src/database/database.service";
import UserService from "./user.service";


@Module({
  controllers: [UserController],
  providers: [
    DatabaseService,
    UserService,
  ]
})
export default class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('user')
  }
}