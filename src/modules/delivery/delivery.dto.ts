import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { DeliveryType, DeliveryStatus } from '../../entities/delivery.entity';

export class CreateDeliveryDto {
  @IsUUID('4', { each: true })
  orders: string[];

  @IsEnum(DeliveryType)
  type: DeliveryType;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateDeliveryDto {
  @IsUUID('4', { each: true })
  @IsOptional()
  orders?: string[];

  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @IsEnum(DeliveryType)
  @IsOptional()
  type?: DeliveryType;
}
