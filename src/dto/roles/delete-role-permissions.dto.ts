import { IsUUID } from 'class-validator';

export class DeleteRolePermissionDto {
  @IsUUID('4', { each: true })
  permissions: string[];
}
