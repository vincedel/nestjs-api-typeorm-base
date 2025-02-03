import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { ResponseInterceptor } from '../common/interceptors/transform.interceptor';
import { CustomValidationPipe } from '../common/pipes/CustomValidationPipe.pipe';

export function configApp(app: INestApplication): INestApplication {
  const config = new DocumentBuilder()
    .setTitle('Title API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new CustomValidationPipe(reflector));

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  return app;
}
