import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity()
export class RolePermission {
  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  deletedAt: Date;

  @PrimaryColumn()
  @Exclude({ toPlainOnly: true })
  roleId: string;

  @PrimaryColumn()
  @Exclude({ toPlainOnly: true })
  permissionId: string;

  @ManyToOne(
    type => Role,
    role => role.id,
    { primary: true },
  )
  @JoinColumn({ name: 'roleId' })
  role: Promise<Role>;

  @ManyToOne(
    type => Permission,
    permission => permission.id,
    {
      primary: true,
      eager: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
