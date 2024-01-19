import { Module } from '@nestjs/common';
import { SocketEvents } from './socketEvents';
import ChatModule from 'src/chat/chat.module';
import FriendsModule from 'src/friends/friends.module';
import GameModule from 'src/game/game.module';

@Module({
  providers: [SocketEvents],
  imports: [ChatModule, FriendsModule, GameModule]
})
export class SocketModule {}
