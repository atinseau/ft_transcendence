import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import DatabaseService from "src/database/database.service";
import GameService from "./game.service"
import UserService from "src/user/user.service";

@Module({
	controllers: [GameController],
	providers: [
		DatabaseService,
		GameService,
		UserService
	],
    exports: [GameService]
})
export default class GameModule {}
