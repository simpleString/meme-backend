import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as AWSConfig } from 'aws-sdk';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);

  AWSConfig.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  const config = new DocumentBuilder()
    .setTitle('MemeBackend')
    .setDescription('Backend server for memeDate app')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    console.log('http://localhost:3000');
  });
}
bootstrap();
