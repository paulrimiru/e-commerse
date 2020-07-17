import { IsUUID } from 'class-validator';

export class UpdateParamDto {
  @IsUUID('4')
  id: string;
}
