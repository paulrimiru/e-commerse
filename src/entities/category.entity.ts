import { Entity, Column, OneToMany } from 'typeorm';

import { Base } from './base';
import { Product } from './product.entity';

@Entity()
export class Category extends Base {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  picture: string;

  @OneToMany(type => Product, product => product.category)
  products: Product[];
}
