import { IRequest } from '@/utils/interfaces';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';

import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { OrderService } from './order.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Request() request: IRequest,
    @Body() orderDetails: CreateOrderDto,
  ) {
    return await this.orderService.createOrder(orderDetails, request.user);
  }

  @Get()
  async getOrder(@Request() request: IRequest) {
    return await this.orderService.getUserOrders(request.user.id);
  }

  @Put(':id')
  async updateOrder(
    @Request() request: IRequest,
    @Param('id') id: string,
    @Body() update: CreateOrderDto,
  ) {
    return await this.orderService.updateOrderItems(
      id,
      request.user.id,
      update,
    );
  }

  @Patch(':id')
  async updateOrderStatus(
    @Request() request: IRequest,
    @Param('id') id: string,
    @Query() query: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateOrderStatus(
      id,
      request.user.id,
      query.status,
    );
  }

  @Delete(':id')
  async deleteOrder(@Request() request: IRequest, @Param('id') id: string) {
    return await this.orderService.deleteOrder(id, request.user.id);
  }
}
