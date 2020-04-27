import {
  Injectable,
  Inject,
  flatten,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';

import { Order, OrderStatus } from '@/entities/order.entity';
import { User } from '@/entities/user.entity';
import { ProductItem } from '@/entities/product-item.entity';

import { ORDER_REPOSITORY } from './constants';
import { CreateOrderDto, ProductOrder } from './order.dto';
import { ProductItemService } from '../product-item/product-item.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: Repository<Order>,
    private readonly productItemService: ProductItemService,
  ) {}

  async createOrder({ products: items, address }: CreateOrderDto, user: User) {
    const { productItems, totalPrice } = await this.getProductItems(items);

    const order = new Order();
    order.items = productItems;
    order.totalAmount = totalPrice;
    order.address = address;
    order.user = user;

    return await this.orderRepository.save(order);
  }

  async updateOrderItems(
    orderId: string,
    userId: string,
    { products }: CreateOrderDto,
  ) {
    const { productItems } = await this.getProductItems(products);
    const order = await this.getOrderById(orderId, userId);

    order.items = Array.from(new Set([...order.items, ...productItems]));
    return await this.orderRepository.save(order);
  }

  // TODO free up product items on cancel and delete them on order status changed to complete
  async updateOrderStatus(
    orderId: string,
    userId: string,
    orderStatus: OrderStatus,
  ) {
    const order = await this.getOrderById(orderId, userId);
    order.orderStatus = orderStatus;

    return await this.orderRepository.save(order);
  }

  async deleteOrder(orderId: string, userId: string) {
    const order = await this.getOrderById(orderId, userId);

    await this.orderRepository.softRemove(order);

    return { id: orderId };
  }

  async getUserOrders(userId: string) {
    const order = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return order;
  }

  // TODO: implement Many to Many relationship between Product item and Order to allow items in cart to be shared by orders
  private async getProductItems(items: ProductOrder[]) {
    let totalPrice: number = 0;

    const result = await Promise.all(
      items.map(async ({ id, quantity }) => {
        const product = await this.productItemService.getProductItemsByProductId(
          id,
        );
        const [prodItems, prod] = await Promise.all([
          Promise.all(
            product.map(async item => ({ ...item, order: await item.order })),
          ),
          product[0].product,
        ]);

        const requiredProductItems = prodItems
          .filter(item => !item.order)
          .slice(0, quantity);

        if (!requiredProductItems.length) {
          throw new InternalServerErrorException(
            `product ${id} is out of stock`,
          );
        }

        totalPrice += prod.unitPrice.price * quantity;

        return requiredProductItems;
      }),
    );

    const productItems: ProductItem[] = flatten(result);

    return { productItems, totalPrice };
  }

  async getOrders(orderIds: string[]) {
    return await this.orderRepository.findAndCount({
      id: In(orderIds),
    });
  }

  private async getOrderById(orderId: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: {
          id: userId,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`order with id ${orderId} not found`);
    }

    return order;
  }
}
