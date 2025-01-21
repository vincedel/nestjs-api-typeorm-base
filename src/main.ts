import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { configApp } from './config/main-config';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, { logger: new Logger() });

  app = configApp(app);

  await app.listen(3001);
}
bootstrap();
