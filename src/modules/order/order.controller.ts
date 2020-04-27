import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  Put,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import { IRequest } from '@/utils/interfaces';

import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Post()
  async createOrder(
    @Request() request: IRequest,
    @Body() orderDetails: CreateOrderDto,
  ) {
    return await this.orderService.createOrder(orderDetails, request.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get()
  async getOrder(@Request() request: IRequest) {
    return await this.orderService.getUserOrders(request.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Delete(':id')
  async deleteOrder(@Request() request: IRequest, @Param('id') id: string) {
    return await this.orderService.deleteOrder(id, request.user.id);
  }
}
