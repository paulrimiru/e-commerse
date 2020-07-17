import { IsUUID } from 'class-validator';

export class DeleteParamDto {
  @IsUUID('4')
  id: string;
}
