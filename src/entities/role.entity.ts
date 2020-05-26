import { Column, Entity, getRepository, OneToMany } from 'typeorm';

import { Base } from './base';
import { RolePermission } from './role-permission.entity';
import { User } from './user.entity';

@Entity()
export class Role extends Base {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column('boolean', { default: false })
  default: boolean;

  @OneToMany(
    type => User,
    user => user.role,
  )
  users: Promise<User[]>;

  @OneToMany(
    type => RolePermission,
    permissions => permissions.role,
    {
      eager: true,
      cascade: true,
    },
  )
  permissions: RolePermission[];
}

export const roleRepository = () => getRepository(Role);
