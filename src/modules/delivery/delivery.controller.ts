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

import { CreateDeliveryDto, UpdateDeliveryDto } from './delivery.dto';
import { DeliveryService } from './delivery.service';
import { DeliveryPermission } from '@/utils/entities-permissions';
import { Scope } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ResponseTransformInterceptor)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Scope(DeliveryPermission.Get)
  @Get()
  async getDeliveries() {
    return await this.deliveryService.getDeliveries();
  }

  @Scope(DeliveryPermission.View)
  @Get(':id')
  async getDeliveryById(@Param('id') id: string) {
    return await this.deliveryService.getDeliveryById(id);
  }

  @Scope(DeliveryPermission.Create)
  @Post()
  async createDelivery(@Body() deliveryDetails: CreateDeliveryDto) {
    return await this.deliveryService.createDelivery(deliveryDetails);
  }

  @Scope(DeliveryPermission.Update)
  @Put(':id')
  async updateDelivery(
    @Param('id') id: string,
    @Body() deliveryUpdate: UpdateDeliveryDto,
  ) {
    return await this.deliveryService.updateDelivery(id, deliveryUpdate);
  }

  @Scope(DeliveryPermission.Delete)
  @Delete(':id')
  async deleteDelivery(@Param('id') id: string) {
    return await this.deliveryService.deleteDelivery(id);
  }
}
