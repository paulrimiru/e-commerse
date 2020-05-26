import * as R from 'ramda';
import { In, Repository } from 'typeorm';

import { CreatePermissionDto, CreateRoleDetails } from '@/dto';
import { UpdatePermissionDto } from '@/dto/roles/update-permission.dto';
import { UpdateRoleDto } from '@/dto/roles/update-role.dto';
import { Permission } from '@/entities/permission.entity';
import { RolePermission } from '@/entities/role-permission.entity';
import { Role, roleRepository } from '@/entities/role.entity';
import {
  PERMISSIONS_REPOSITORY,
  ROLE_PERMISSION_REPOSITORY,
  ROLES_REPOSITORY,
} from '@/utils/constants';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: Repository<Role>,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionRepository: Repository<Permission>,
    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async createPermission(permissionDetails: CreatePermissionDto) {
    return await this.permissionRepository.save(permissionDetails.toEntity());
  }

  async createRole(roleDetails: CreateRoleDetails) {
    const permissions: Permission[] = await this.permissionRepository.findByIds(
      roleDetails.permissions,
    );

    const role = new Role();
    role.name = roleDetails.name;
    role.description = roleDetails.description;

    const savedRole = await this.rolesRepository.save(role);

    await this.insertRolePermissions(permissions, savedRole);

    const updatedRole = await this.rolesRepository.findOneOrFail(savedRole.id);

    return updatedRole;
  }

  private async insertRolePermissions(
    permissions: Permission[],
    savedRole: Role,
  ) {
    await Promise.all(
      permissions.map(async ({ id }) => {
        const rolePermission = new RolePermission();
        rolePermission.roleId = savedRole.id;
        rolePermission.permissionId = id;
        return await this.rolePermissionRepository.save(rolePermission);
      }),
    );
  }

  async getRoleById(roleId: string) {
    const role = await this.rolesRepository.findOne(roleId);

    if (!role) {
      throw new NotFoundException(`role with id ${roleId} does not exist`);
    }

    return role;
  }

  async getAllRoles() {
    return await this.rolesRepository.find();
  }

  async getDefaultRole() {
    return await this.rolesRepository.findOne({ default: true });
  }

  async getPermissionById(permissionId: string) {
    const permission = await this.permissionRepository.findOne(permissionId);

    if (!permission) {
      throw new NotFoundException(
        `permission with id ${permissionId} does not exist`,
      );
    }

    return permission;
  }

  async getAllPermissions() {
    return await this.permissionRepository.find();
  }

  async updatePermission(
    id: string,
    permissionDetails: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.getPermissionById(id);

    const updatedPermission: Permission = Object.assign(
      {},
      permission,
      permissionDetails,
    );

    return await this.permissionRepository.save<Permission>(updatedPermission);
  }

  async updateRole(id: string, roleDetails: UpdateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id);

    await this.rolesRepository.update(id, R.omit(['permissions'], roleDetails));

    if (!roleDetails.permissions) {
      return await this.rolesRepository.findOne(id);
    }

    const permissions = roleDetails.permissions;

    await this.verifyRolePermissionDoesNotExist(id, permissions);

    const savedPermissions = await this.permissionRepository.findByIds(
      permissions,
    );

    if (savedPermissions.length !== permissions.length) {
      throw new NotFoundException(
        `permissions (${R.difference(
          permissions,
          savedPermissions.map(perm => perm.id),
        )}) do not exist`,
      );
    }

    await this.insertRolePermissions(savedPermissions, role);

    return await this.rolesRepository.findOne(id);
  }

  async deleteRolePermissions(id: string, permissions: string[]) {
    const role = await this.getRoleById(id);
    await this.rolePermissionRepository.delete({
      roleId: role.id,
      permissionId: In(permissions),
    });

    return await this.rolesRepository.findOne(id);
  }

  async deleteRole(id: string) {
    await this.getRoleById(id);

    await this.rolesRepository.delete(id);

    return { id };
  }

  async deletePermission(id: string) {
    await this.getPermissionById(id);

    await this.permissionRepository.delete(id);

    return { id };
  }

  async verifyRolePermissionDoesNotExist(
    roleId: string,
    permissions: string[],
  ) {
    const rolePermissions = await this.rolePermissionRepository.find({
      roleId,
      permissionId: In(permissions),
    });

    if (rolePermissions.length) {
      throw new ConflictException(
        `permissions ${rolePermissions
          .map(({ permission }) => permission.name)
          .toString()} provided are already assigned to this role`,
      );
    }
  }

  async selectDefaultRole(roleId: string) {
    const role = await this.getRoleById(roleId);
    const currentDefault = await this.getDefaultRole();

    if (!currentDefault) {
      currentDefault.default = false;
    }

    role.default = true;

    await Promise.all([
      this.rolesRepository.update(role.id, role),
      this.rolesRepository.update(currentDefault.id, currentDefault),
    ]);

    return role;
  }
}
