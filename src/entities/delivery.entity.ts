import { Entity, Column, OneToMany } from 'typeorm';

import { Order } from './order.entity';

import { Base } from './base';

export enum DeliveryStatus {
  Preperation = 'preperation',
  Dispatched = 'dispatched',
  Completed = 'completed',
  Canceled = 'canceled',
}

export enum DeliveryType {
  PickUp = 'pick-up',
  DropOff = 'drop-off',
}

@Entity()
export class Delivery extends Base {
  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.Preperation,
  })
  status: DeliveryStatus;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.DropOff,
  })
  type: DeliveryType;

  @OneToMany(type => Order, order => order.delivery, {
    eager: true,
    cascade: true,
  })
  orders: Order[];
}
