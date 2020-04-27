import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain } from 'class-transformer';

import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';

import { ProductService } from './product.service';
import { CreateProductDto, CreateProductItemDto } from './product.dto';
import { CategoryService } from '../category/category.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateCategoryDto } from '../category/category.dto';
import { ProductItemService } from '../product-item/product-item.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly productItemService: ProductItemService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);

    return classToPlain(product);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updates: UpdateCategoryDto,
  ) {
    return await this.productService.updateProduct(id, updates);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('items/:id')
  async getProductItems(@Param('id') id: string) {
    return await this.productItemService.getProductItemsByProductId(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Delete('items/:id')
  async deleteProductItems(@Param('id') id: string) {
    await this.productItemService.deleteProductItem(id);
    return { id };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Put('items/:id')
  async updateProductItems(
    @Param('id') id: string,
    @Body('serialNumber') serialNumber: string,
  ) {
    await this.productItemService.updateProductItem(id, serialNumber);
    return { id };
  }
}
