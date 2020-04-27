import { Entity, Column, ManyToOne } from 'typeorm';

import { Base } from './base';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class ProductItem extends Base {
  @Column({ unique: true })
  serialNumber: string;

  @ManyToOne(type => Product, product => product.items)
  product: Promise<Product>;

  @ManyToOne(type => Order, order => order.items)
  order: Promise<Order>;
}
