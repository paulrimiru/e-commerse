import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Category } from '@/entities/category.entity';

import { CATEGORY_REPOSITORY } from '../product/constants';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new NotFoundException(`category with id ${id} not found`);
    }

    return category;
  }

  async getAllCategories() {
    return await this.categoryRepo.find();
  }

  async createCategory(categoryData: CreateCategoryDto) {
    const category = new Category();

    category.name = categoryData.name;
    category.description = categoryData.description;
    category.picture = categoryData.picture;

    return await this.categoryRepo.save(category);
  }

  async updateCategory(id, updates) {
    const category = await this.getCategoryById(id);

    Object.assign(category, updates);

    return await this.categoryRepo.save(category);
  }

  async deleteCategory(id: string) {
    return await this.categoryRepo.softDelete(id);
  }
}
