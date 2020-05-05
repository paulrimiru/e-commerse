import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';

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
