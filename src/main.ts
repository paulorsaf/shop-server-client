import * as admin from 'firebase-admin';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert('./src/service-account.json')
  })

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug']
  });

  app.enableCors({
    origin: '*'
  })

  await app.listen(3000);
}
bootstrap();
