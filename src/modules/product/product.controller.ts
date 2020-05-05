import { classToPlain } from 'class-transformer';

import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { UpdateCategoryDto } from '../category/category.dto';
import { CategoryService } from '../category/category.service';
import { ProductItemService } from '../product-item/product-item.service';
import {
  CreateProductDto,
  CreateProductItemDto,
  SearchQueryDto,
} from './product.dto';
import { ProductService } from './product.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly productItemService: ProductItemService,
  ) {}

  private readonly logger = new Logger(ProductController.name);

  @Get('single/:id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);

    return classToPlain(product);
  }

  @Get()
  async getProductsByCategory(@Query() query: { category: string }) {
    if (query.category) {
      const products = await this.productService.getProductByCategory(
        query.category,
      );

      if (products) {
        return products.map(product => classToPlain(product));
      }

      return products;
    }

    return (await this.productService.getAllProducts()).map(product =>
      classToPlain(product),
    );
  }

  @Get('search')
  async searchProducts(@Query() { name }: SearchQueryDto) {
    const products = await this.productService.searchProduct(name);
    return classToPlain(products);
  }

  @Post()
  async createProduct(@Body() productData: CreateProductDto) {
    const category = await this.categoryService.getCategoryById(
      productData.category,
    );

    const product = await this.productService.createProduct(
      productData,
      category,
    );

    return classToPlain(product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updates: UpdateCategoryDto,
  ) {
    return await this.productService.updateProduct(id, updates);
  }

  @Post('items/:id')
  async addProductItem(
    @Param('id') id: string,
    @Body() items: CreateProductItemDto,
  ) {
    const {
      id: productId,
    } = await this.productItemService.batchAddProductItems(id, items);
    return { id: productId };
  }

  @Get('items/:id')
  async getProductItems(@Param('id') id: string) {
    return await this.productItemService.getProductItemsByProductId(id);
  }

  @Delete('items/:id')
  async deleteProductItems(@Param('id') id: string) {
    await this.productItemService.deleteProductItem(id);
    return { id };
  }

  @Put('items/:id')
  async updateProductItems(
    @Param('id') id: string,
    @Body('serialNumber') serialNumber: string,
  ) {
    await this.productItemService.updateProductItem(id, serialNumber);
    return { id };
  }
}
