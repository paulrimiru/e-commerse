import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';

import { DATABASE_CONNECTION } from '@/utils/constants';
import { DatabaseModule } from '@/modules/db/database.module';
import { Category } from '@/entities/category.entity';

import { CategoryService } from './category.service';
import { CATEGORY_REPOSITORY } from '../product/constants';
import { CategoryController } from './category.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CATEGORY_REPOSITORY,
      useFactory: (connection: Connection) =>
        connection.getRepository(Category),
      inject: [DATABASE_CONNECTION],
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
