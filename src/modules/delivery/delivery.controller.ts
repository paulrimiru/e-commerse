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
} from '@nestjs/common';

import { CreateDeliveryDto, UpdateDeliveryDto } from './delivery.dto';
import { DeliveryService } from './delivery.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  async getDeliveries() {
    return await this.deliveryService.getDeliveries();
  }

  @Get(':id')
  async getDeliveryById(@Param('id') id: string) {
    return await this.deliveryService.getDeliveryById(id);
  }

  @Post()
  async createDelivery(@Body() deliveryDetails: CreateDeliveryDto) {
    return await this.deliveryService.createDelivery(deliveryDetails);
  }

  @Put(':id')
  async updateDelivery(
    @Param('id') id: string,
    @Body() deliveryUpdate: UpdateDeliveryDto,
  ) {
    return await this.deliveryService.updateDelivery(id, deliveryUpdate);
  }

  @Delete(':id')
  async deleteDelivery(@Param('id') id: string) {
    return await this.deliveryService.deleteDelivery(id);
  }
}
