import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { genSalt, hash, compare } from 'bcrypt';

import { Base } from './base';
import { Order } from './order.entity';
import { Role } from './role.entity';

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

  @ManyToOne(
    type => Role,
    role => role.users,
    {
      nullable: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  role: Role;

  @Column()
  @Exclude()
  protected password: string;

  @OneToMany(
    type => Order,
    order => order.user,
    { lazy: true },
  )
  orders: Promise<Order[]>;

  async setPassword(password) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
  }

  async checkPassword(password) {
    return await compare(password, this.password);
  }
}
