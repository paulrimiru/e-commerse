import { Unit } from '@/entities/unit-price';
import { IsNotEmpty, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNumber()
  discount: number;

  @IsNotEmpty()
  pictures: string[];

  @IsNotEmpty()
  @IsUUID()
  category: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateProductDto {
  name?: string;

  unit?: Unit;

  price?: number;

  quantity?: number;

  discount?: number;

  pictures?: string[];

  category?: string;
}

// tslint:disable-next-line:max-classes-per-file
export class CreateProductItemDto {
  @IsNotEmpty()
  items: string[];
}
