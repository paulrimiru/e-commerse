// tslint:disable-next-line:no-var-requires
require('module-alias/register');

import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { UserModule } from '@/modules/user/user.module';
import { AppService } from '@/modules/app/app.service';

import { AppController } from './app.controller';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    DeliveryModule,
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
