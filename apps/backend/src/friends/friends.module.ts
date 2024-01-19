import { Module } from "@nestjs/common";
import { FriendsController } from "./friends.controller";
import DatabaseService from "src/database/database.service";
import FriendsService from "./friends.service"

@Module({
	controllers: [FriendsController],
	providers: [
		DatabaseService,
		FriendsService
	],
    exports: [FriendsService]
})
export default class FriendsModule {}
