import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from './base';
import { RolePermission } from './role-permission.entity';

@Entity()
export class Permission extends Base {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(
    type => RolePermission,
    rolePermission => rolePermission.permission,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  permissionRole: RolePermission[];
}
