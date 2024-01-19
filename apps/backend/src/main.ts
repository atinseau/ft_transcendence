import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { type NestExpressApplication, MulterModule } from '@nestjs/platform-express';
import { _DESTINATION } from './path-configuration';
process.title = '@ft/backend';


MulterModule.register({
  dest: _DESTINATION,
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();
  app.useStaticAssets(_DESTINATION, {
    prefix: '/public/',
    //http://localhost:8080/public/default.png
  });

  await app.listen(process.env.BACKEND_PORT || 8080);
}
bootstrap();
