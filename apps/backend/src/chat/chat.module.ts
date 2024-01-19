import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import DatabaseService from "src/database/database.service";
import ChatService from "./chat.service";

@Module({
	controllers: [ChatController],
	providers: [
		DatabaseService,
		ChatService
	],
    exports: [ChatService]
})
export default class ChatModule {}