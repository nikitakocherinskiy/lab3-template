import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = JSON.parse(
    (await readFile('openapi.json')).toString('utf-8'),
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
