import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';


async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./ssl/0000_key-certbot.pem'),
    cert: fs.readFileSync('./ssl/0000_csr-certbot.pem'),
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
