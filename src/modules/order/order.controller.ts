import { OrderPermission } from '@/utils/entities-permissions';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Scope } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { OrderService } from './order.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ResponseTransformInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Scope(OrderPermission.Create)
  @Post()
  async createOrder(
    @Request() request: IRequest,
    @Body() orderDetails: CreateOrderDto,
  ) {
    return await this.orderService.createOrder(orderDetails, request.user);
  }

  @Scope(OrderPermission.Get)
  @Get()
  async getOrder(@Request() request: IRequest) {
    return await this.orderService.getUserOrders(request.user.id);
  }

  @Scope(OrderPermission.Update)
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

  @Scope(OrderPermission.Update)
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

  @Scope(OrderPermission.Delete)
  @Delete(':id')
  async deleteOrder(@Request() request: IRequest, @Param('id') id: string) {
    return await this.orderService.deleteOrder(id, request.user.id);
  }
}
