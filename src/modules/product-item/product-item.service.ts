import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { ProductItem } from '@/entities/product-item.entity';

import { ProductService } from '../product/product.service';
import { PRODUCT_ITEM_REPOSITORY } from '../product/constants';
import { CreateProductItemDto } from '../product/product.dto';

@Injectable()
export class ProductItemService {
  constructor(
    private readonly productService: ProductService,
    @Inject(PRODUCT_ITEM_REPOSITORY)
    private readonly productItemRepository: Repository<ProductItem>,
  ) {}

  async batchAddProductItems(productId, { items }: CreateProductItemDto) {
    const product = await this.productService.getProductById(productId);

    const existingItems = await product.items;

    const newItems = await Promise.all(
      items.map(async serialNumber => {
        return await this.productItemRepository.save(
          plainToClass(ProductItem, { serialNumber }),
        );
      }),
    );

    product.items = Promise.resolve(
      Array.from(new Set<ProductItem[]>([newItems.concat(existingItems)]))[0],
    );

    return await this.productService.saveProduct(product);
  }

  // TODO: Fix duplicate entry bug
  async addProductItem(productId: string, serialNumber: string) {
    const product = await this.productService.getProductById(productId);

    const existingItems = await product.items;
    product.items = Promise.resolve([
      ...existingItems,
      plainToClass(ProductItem, { serialNumber }),
    ]);

    return await this.productService.saveProduct(product);
  }

  async deleteProductItem(id: string) {
    return await this.productItemRepository.softDelete(id);
  }

  async updateProductItem(id: string, serialNumber: string) {
    const productItem = await this.getProductItemById(id);

    productItem.serialNumber = serialNumber;

    await this.productItemRepository.save(productItem);
  }

  async getProductItemById(id: string) {
    const productItem = await this.productItemRepository.findOne(id);

    if (!productItem) {
      throw new NotFoundException(`product item with id ${id} not found`);
    }

    return productItem;
  }

  async getProductItemsByProductId(productId: string) {
    const product = await this.productService.getProductById(productId);

    return await product.items;
  }
}
