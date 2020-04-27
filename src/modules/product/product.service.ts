import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Product } from '@/entities/product.entity';
import { Category } from '@/entities/category.entity';

import { PRODUCT_REPOSITORY } from './constants';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    return await this.productRepository.find();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`product with id ${id} not found`);
    }

    return product;
  }

  async getProductByCategory(categoryId: string) {
    return await this.productRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }

  async createProduct(productData: CreateProductDto, category: Category) {
    const product = new Product();

    product.name = productData.name;
    product.quantity = productData.quantity;
    product.unitPrice = {
      unit: productData.unit,
      price: productData.price,
    };
    product.discount = productData.discount;
    product.pictures = productData.pictures;
    product.category = Promise.resolve(category);

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    return await this.productRepository.softDelete(id);
  }

  async updateProduct(id: string, updates) {
    const product = await this.getProductById(id);

    Object.assign(product, updates);

    return await this.saveProduct(product);
  }

  async saveProduct(product: Product) {
    return await this.productRepository.save(product);
  }
}
