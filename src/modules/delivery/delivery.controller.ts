import {
  Controller,
  UseInterceptors,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './delivery.dto';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get()
  async getDeliveries() {
    return await this.deliveryService.getDeliveries();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get(':id')
  async getDeliveryById(@Param('id') id: string) {
    return await this.deliveryService.getDeliveryById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Post()
  async createDelivery(@Body() deliveryDetails: CreateDeliveryDto) {
    return await this.deliveryService.createDelivery(deliveryDetails);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Put(':id')
  async updateDelivery(
    @Param('id') id: string,
    @Body() deliveryUpdate: UpdateDeliveryDto,
  ) {
    return await this.deliveryService.updateDelivery(id, deliveryUpdate);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Delete(':id')
  async deleteDelivery(@Param('id') id: string) {
    return await this.deliveryService.deleteDelivery(id);
  }
}
