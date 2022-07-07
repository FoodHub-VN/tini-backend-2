import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {readFileSync} from 'fs'

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./ssl/private.key', 'utf8'),
    cert: readFileSync('./ssl/public.crt', 'utf8'),
  };
  const app = await NestFactory.create(AppModule, {cors: true, httpsOptions});
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  // app.useStaticAssets(join(__dirname, "..", "upload"));
  // add swagger module
  const config = new DocumentBuilder()
    .setTitle("[FoodHub APIs]")
    .setDescription("The RESTful APIs from super dev")
      .setVersion('1.0')
      .addTag('FoodHub')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3007);
}

bootstrap();
