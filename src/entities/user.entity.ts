import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { genSalt, hash, compare } from 'bcrypt';

import { Base } from './base';
import { Order } from './order.entity';

export enum Role {
  Admin = 'admin',
  User = 'user',
  Unverified = 'un-verified',
}

@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Unverified,
  })
  role: Role;

  @Column()
  @Exclude()
  protected password: string;

  @OneToMany(type => Order, order => order.user, { lazy: true })
  orders: Promise<Order[]>;

  async setPassword(password) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
  }

  async checkPassword(password) {
    return await compare(password, this.password);
  }
}
