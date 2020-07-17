import { Connection, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CreatePermissionDto, CreateRoleDetails } from '@/dto';
import { Permission } from '@/entities/permission.entity';
import { RolePermission } from '@/entities/role-permission.entity';
import { Role } from '@/entities/role.entity';
import { User } from '@/entities/user.entity';
import { createTestDb } from '@/utils/testdb';
import { HttpStatus } from '@nestjs/common';

import { RolesService } from './roles.service';

describe('RoleService', () => {
  let roleService: RolesService;

  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;
  let rolePermissionRepository: Repository<RolePermission>;

  let samplePermission: Permission;
  let sampleRole: Role;
  let sampleRolePermission: RolePermission;

  let db: Connection;

  beforeAll(async () => {
    db = await createTestDb([Role, Permission, RolePermission, User]);

    roleRepository = db.getRepository(Role);
    permissionRepository = db.getRepository(Permission);
    rolePermissionRepository = db.getRepository(RolePermission);

    roleService = new RolesService(
      roleRepository,
      permissionRepository,
      rolePermissionRepository,
    );
  });

  beforeEach(async () => {
    samplePermission = await permissionRepository.save({
      name: 'sample-perm',
      description: 'sample perm desc',
    });

    sampleRole = await roleRepository.save({
      name: 'sample-role',
      description: 'sample role desc',
    });

    sampleRolePermission = await rolePermissionRepository.save({
      permissionId: samplePermission.id,
      roleId: sampleRole.id,
    });

    sampleRole = await roleRepository.findOne(sampleRole.id);
    samplePermission = await permissionRepository.findOne(samplePermission.id);
  });

  afterEach(async () => {
    await db.synchronize(true);
  });

  afterAll(async () => {
    await db.close();
  });

  it('creates a new permission successfully', async () => {
    const permissionDetails = new CreatePermissionDto();

    permissionDetails.name = 'test';
    permissionDetails.description = 'test description';

    const result = await roleService.createPermission(permissionDetails);

    expect(result.name).toEqual('test');
  });

  it('creates a role successfully', async () => {
    const initial = await roleRepository.find();

    expect(initial.length).toEqual(1);

    const roleDetails = new CreateRoleDetails();

    roleDetails.permissions = [samplePermission.id];
    roleDetails.name = 'test';
    roleDetails.description = 'test role';

    const result = await roleService.createRole(roleDetails);

    expect(result.name).toEqual('test');
    expect(result.permissions.length).toEqual(1);
    expect(result.permissions[0].permissionId).toEqual(samplePermission.id);

    const final = await roleRepository.find();

    expect(final.length).toEqual(2);
  });

  it('updates a permission successfully', async () => {
    const updateDetails = {
      name: 'updated-perm',
      description: 'updated perm description',
    };

    const result = await roleService.updatePermission(
      samplePermission.id,
      updateDetails,
    );

    expect(result.id).toEqual(samplePermission.id);
    expect(result.name).toEqual(updateDetails.name);
    expect(result.description).toEqual(updateDetails.description);
  });

  it('updates a role successfully', async () => {
    const updateDetails = {
      name: 'updated-role',
      description: 'updated role description',
    };

    const result = await roleService.updateRole(sampleRole.id, updateDetails);

    expect(result.id).toEqual(sampleRole.id);
    expect(result.name).toEqual(updateDetails.name);
    expect(result.description).toEqual(updateDetails.description);
  });

  it('adds permissions to an existing role', async () => {
    const permission = await permissionRepository.save({
      name: 'test-permission',
      description: 'test permission description',
    });

    expect(sampleRole.permissions.length).toEqual(1);

    const result = await roleService.updateRole(sampleRole.id, {
      permissions: [permission.id],
    });

    expect(result.id).toEqual(sampleRole.id);

    const updatedRole = await roleRepository.findOne(sampleRole.id);
    expect(updatedRole.permissions.length).toEqual(2);
    expect(
      updatedRole.permissions.find(
        ({ permissionId }) => permissionId === permission.id,
      ),
    ).toBeDefined();
  });

  it('removes a permission from a role', async () => {
    expect(sampleRole.permissions.length).toEqual(1);

    await roleService.deleteRolePermissions(sampleRole.id, [
      samplePermission.id,
    ]);

    const updatedRole = await roleRepository.findOne(sampleRole.id);
    expect(updatedRole.permissions.length).toEqual(0);
  });

  it('get role with invalid id throws an error', async () => {
    try {
      await roleService.getRoleById(uuidv4());
    } catch (error) {
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
    }
  });

  it('assigning a permission already assigned to the same role throws an error', async () => {
    try {
      await roleService.updateRole(sampleRole.id, {
        permissions: [samplePermission.id],
      });
    } catch (error) {
      expect(error.status).toEqual(HttpStatus.CONFLICT);
    }
  });
});
