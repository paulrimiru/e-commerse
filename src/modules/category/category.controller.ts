import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';

import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post()
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return await this.categoryService.createCategory(categoryData);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updates: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updates);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
