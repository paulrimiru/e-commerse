import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { DatabaseModule } from '@/modules/db/database.module';
import { Delivery } from '@/entities/delivery.entity';
import { DATABASE_CONNECTION } from '@/utils/constants';

import { DeliveryService } from './delivery.service';
import { DELIVERY_REPOSITORY } from './constants';
import { DeliveryController } from './delivery.controller';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [DatabaseModule, OrderModule],
  providers: [
    DeliveryService,
    {
      provide: DELIVERY_REPOSITORY,
      useFactory: (connection: Connection) =>
        connection.getRepository(Delivery),
      inject: [DATABASE_CONNECTION],
    },
  ],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
