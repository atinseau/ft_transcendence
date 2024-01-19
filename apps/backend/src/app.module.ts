import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './utils/configuration';
import FriendsModule from './friends/friends.module';
import ChatModule from './chat/chat.module';
import { SocketModule } from './socket/socket.module';
import AuthModule from './auth/auth.module';
import UserModule from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import FortyTwoModule from './fortytwo/fortytwo.module';
import GameModule from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    FortyTwoModule,
    UserModule,
	  FriendsModule,
    ChatModule,
    SocketModule,
    GameModule,
  ],
})
export class AppModule { }