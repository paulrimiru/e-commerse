import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base';
import { Category } from './category.entity';
import { ProductItem } from './product-item.entity';
import { UnitPrice } from './unit-price';

@Entity()
export class Product extends Base {
  @Column({ unique: true })
  name: string;

  @Column(type => UnitPrice)
  unitPrice: UnitPrice;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  discount: number;

  @Column('simple-array')
  pictures: string[];

  @OneToMany(
    type => ProductItem,
    productItem => productItem.product,
  )
  @Exclude({ toPlainOnly: true })
  items: Promise<ProductItem[]>;

  @ManyToOne(
    type => Category,
    category => category.products,
    { eager: true },
  )
  category: Category;
}
