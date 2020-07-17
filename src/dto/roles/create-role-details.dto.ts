import { IsString, IsUUID } from 'class-validator';

export class CreateRoleDetails {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID('4', { each: true })
  permissions: string[];
}
