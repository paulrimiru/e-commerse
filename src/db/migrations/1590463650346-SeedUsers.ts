import { MigrationInterface, QueryRunner } from 'typeorm';
import { Permission } from '@/entities/permission.entity';
import { Role } from '@/entities/role.entity';
import { User } from '@/entities/user.entity';

export class SeedUsers1590463650346 implements MigrationInterface {
  name = 'SeedUsers1590463650346';

  roles = ['admin', 'client', 'seller'];
  resources = [
    'user',
    'product',
    'product-item',
    'category',
    'order',
    'delivery',
  ];

  permissions = this.resources.map(generatePermissions);

  public async up(queryRunner: QueryRunner): Promise<any> {
    // seed permissions
    const savedPermissions = (
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('permission')
        .values(
          this.permissions.reduce((total, current) => [...total, ...current]),
        )
        .returning('*')
        .execute()
    ).generatedMaps as Permission[];

    const [admin, client] = (
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('role')
        .values(this.roles.map(generateRole))
        .execute()
    ).generatedMaps as Role[];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('role_permission')
      .values(
        savedPermissions.map(({ id }) => ({
          permissionId: id,
          roleId: admin.id,
        })),
      )
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('role_permission')
      .values(
        savedPermissions
          .filter(({ name }) => {
            const [permission, resource] = name.split('-');

            const resources = ['delivery', 'order'];
            return resources.includes(resource);
          })
          .map(({ id }) => ({
            permissionId: id,
            roleId: client.id,
          })),
      )
      .execute();

    const user = new User();
    user.username = process.env.SYS_ADMIN.split('@')[0];
    user.email = process.env.SYS_ADMIN;
    await user.setPassword(process.env.SYS_ADMIN_PASSWORD);
    user.role = admin;
    user.verified = true;

    await queryRunner.manager.getRepository('user').save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.manager.getRepository('group_permission').clear();

    await queryRunner.manager.getRepository('group').clear();

    await queryRunner.manager.getRepository('permission').clear();
  }
}

const generatePermissions = (resource: string) =>
  ['create', 'update', 'delete', 'view', 'get'].map(permission => ({
    name: `${permission}-${resource}`,
    description: `permission required to ${permission} ${resource}`,
  }));

const generateRole = (name: string) => ({
  name,
  description: `${name} role`,
  default: name === 'client',
});
