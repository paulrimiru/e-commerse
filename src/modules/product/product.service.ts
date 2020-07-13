import matchSorter from 'match-sorter';
import { Like, Repository, Raw } from 'typeorm';

import { Category } from '@/entities/category.entity';
import { Product } from '@/entities/product.entity';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PRODUCT_REPOSITORY } from './constants';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: Repository<Product>,
  ) {}

  private readonly logger = new Logger(ProductService.name);

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

  async searchProduct(searchString: string) {
    const products = await this.productRepository
      .createQueryBuilder()
      .where(`LOWER(name) = LOWER(:searchString)`, { searchString })
      .getMany();

    return matchSorter(products, searchString, {
      keys: ['name'],
      threshold: matchSorter.rankings.CONTAINS,
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
    product.description = productData.description;
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
