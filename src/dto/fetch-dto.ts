import { IsOptional, IsUUID } from 'class-validator';

export class FetchDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;
}
