import * as admin from 'firebase-admin';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert('./src/service-account.json'),
    storageBucket: 'gs://shop-354211.appspot.com'
  })

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug']
  });

  app.enableCors({origin: '*'});
  app.use(json({ limit: '1mb' }));

  await app.listen(3000);
}
bootstrap();
