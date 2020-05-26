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
  UseGuards,
} from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { CategoryPermission } from '@/utils/entities-permissions';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Scope } from '../auth/roles.decorator';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Scope(CategoryPermission.Create)
  @Post()
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return await this.categoryService.createCategory(categoryData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Scope(CategoryPermission.Update)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updates: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updates);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Scope(CategoryPermission.Delete)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
