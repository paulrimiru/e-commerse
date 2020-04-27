import { Column } from 'typeorm';

export enum Unit {
  kg = 'kg',
  grams = 'grams',
  item = 'item',
  pair = 'pair',
  dozen = 'dozen',
}

export class UnitPrice {
  @Column({
    type: 'enum',
    enum: Unit,
    default: Unit.item,
  })
  unit: string;

  @Column()
  price: number;
}
