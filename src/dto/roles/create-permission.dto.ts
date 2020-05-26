import { IsString } from 'class-validator';

import { Permission } from '@/entities/permission.entity';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  public toEntity(): Permission {
    const permission = new Permission();
    permission.description = this.description;
    permission.name = this.name;
    return permission;
  }
}
