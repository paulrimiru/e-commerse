import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
  IsString,
} from 'class-validator';
import { OrderStatus } from '@/entities/order.entity';

export class CreateOrderDto {
  @IsString()
  address: string;

  @IsNotEmpty()
  products: ProductOrder[];
}

// tslint:disable-next-line: max-classes-per-file
export class ProductOrder {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  id: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
