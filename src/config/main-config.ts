import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/transform.interceptor';
import { Reflector } from '@nestjs/core';

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

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  return app;
}
