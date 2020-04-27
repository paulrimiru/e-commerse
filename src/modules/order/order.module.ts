import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { DatabaseModule } from '@/modules/db/database.module';
import { Order } from '@/entities/order.entity';
import { DATABASE_CONNECTION } from '@/utils/constants';

import { ORDER_REPOSITORY } from './constants';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { OrderController } from './order.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [DatabaseModule, ProductModule, UserModule],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useFactory: (connection: Connection) => connection.getRepository(Order),
      inject: [DATABASE_CONNECTION],
    },
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
