import { Connection } from 'typeorm';

import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/modules/db/database.module';
import { Product } from '@/entities/product.entity';
import { DATABASE_CONNECTION } from '@/utils/constants';

import { ProductService } from './product.service';
import { PRODUCT_REPOSITORY, PRODUCT_ITEM_REPOSITORY } from './constants';
import { CategoryModule } from '../category/category.module';
import { ProductController } from './product.controller';
import { ProductItemService } from '../product-item/product-item.service';
import { ProductItem } from '@/entities/product-item.entity';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductItemService,
    {
      provide: PRODUCT_ITEM_REPOSITORY,
      useFactory: (connection: Connection) =>
        connection.getRepository(ProductItem),
      inject: [DATABASE_CONNECTION],
    },
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (connection: Connection) => connection.getRepository(Product),
      inject: [DATABASE_CONNECTION],
    },
  ],
  exports: [ProductItemService],
})
export class ProductModule {}
