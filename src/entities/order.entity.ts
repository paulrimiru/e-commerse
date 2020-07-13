import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base';
import { Delivery } from './delivery.entity';
import { ProductItem } from './product-item.entity';
import { User } from './user.entity';

export enum OrderStatus {
  Cart = 'cart',
  Delivery = 'delivery',
  Complete = 'complete',
  Canceled = 'canceled',
}

export interface Coordinates {
  longitude: string;
  latitude: string;
}

@Entity()
export class Order extends Base {
  @Column({ nullable: true })
  totalAmount: number;

  @Column()
  address: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  coordinates: Coordinates;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Cart,
  })
  orderStatus: OrderStatus;

  @OneToMany(
    type => ProductItem,
    productItem => productItem.order,
    {
      eager: true,
      cascade: true,
    },
  )
  items: ProductItem[];

  @ManyToOne(
    type => User,
    user => user.orders,
    { eager: true, cascade: false },
  )
  user: User;

  @ManyToOne(
    type => Delivery,
    delivery => delivery.orders,
  )
  delivery: Promise<Delivery>;
}
