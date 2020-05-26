import { Connection } from 'typeorm';

import { Permission } from '@/entities/permission.entity';
import { RolePermission } from '@/entities/role-permission.entity';
import { Role } from '@/entities/role.entity';
import {
  DATABASE_CONNECTION,
  PERMISSIONS_REPOSITORY,
  ROLE_PERMISSION_REPOSITORY,
  ROLES_REPOSITORY,
} from '@/utils/constants';

export const rolesProviders = [
  {
    provide: ROLES_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(Role),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: PERMISSIONS_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(Permission),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: ROLE_PERMISSION_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(RolePermission),
    inject: [DATABASE_CONNECTION],
  },
];
