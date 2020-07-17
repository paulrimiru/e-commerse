import { IsUUID } from 'class-validator';

export class AssignRoleBodyDto {
  @IsUUID('4')
  role: string;
}
