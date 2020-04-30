import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

// tslint:disable-next-line:no-var-requires
require('module-alias/register');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({ validationError: { target: false, value: false } }),
  );
  app.use(morgan('dev'));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
