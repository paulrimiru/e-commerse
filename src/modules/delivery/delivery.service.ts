import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DELIVERY_REPOSITORY } from './constants';
import { Repository } from 'typeorm';
import { Delivery } from '@/entities/delivery.entity';
import { OrderService } from '../order/order.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly orderService: OrderService,
  ) {}

  async createDelivery({ orders: orderIds, type }: CreateDeliveryDto) {
    const [orders, count] = await this.orderService.getOrders(orderIds);

    if (count !== orderIds.length) {
      throw new BadRequestException("some of the orders provided don't exist");
    }

    const delivery = new Delivery();
    delivery.orders = orders;
    delivery.type = type;

    return await this.deliveryRepository.save(delivery);
  }

  async updateDelivery(id: string, updates: UpdateDeliveryDto) {
    const delivery = await this.deliveryRepository.findOne(id);

    if (!delivery) {
      throw new NotFoundException(`delivery with ${id} not found`);
    }

    if (updates.orders) {
      const [orders, count] = await this.orderService.getOrders(updates.orders);

      if (count !== updates.orders.length) {
        throw new BadRequestException(
          "some of the orders provided don't exist",
        );
      }

      delivery.orders = Array.from(new Set([...delivery.orders, ...orders]));
    }

    if (updates.type) {
      delivery.type = updates.type;
    }

    if (updates.status) {
      delivery.status = updates.status;
    }

    return await this.deliveryRepository.save(delivery);
  }

  async deleteDelivery(id: string) {
    return await this.deliveryRepository.softDelete(id);
  }

  async getDeliveries() {
    return await this.deliveryRepository.find();
  }

  async getDeliveryById(id: string) {
    const delivery = await this.deliveryRepository.findOne(id);

    if (!delivery) {
      throw new NotFoundException(`delivery with ${id} not found`);
    }

    return delivery;
  }
}
