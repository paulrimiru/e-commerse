import { SetMetadata } from '@nestjs/common';

export const Scope = (permission: string) =>
  SetMetadata('permission', permission);
