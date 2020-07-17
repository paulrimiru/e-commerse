import { classToPlain, plainToClass } from 'class-transformer';

import {
  CreatePermissionDto,
  CreateRoleDetails,
  DeleteParamDto,
  DeleteRolePermissionDto,
  FetchDto,
  UpdateParamDto,
  UpdatePermissionDto,
  UpdateRoleDto,
} from '@/dto';
import {
  PermissionsPermission,
  RolesPermission,
} from '@/utils/entities-permissions';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Scope } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ResponseTransformInterceptor)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Scope(RolesPermission.Create)
  @Post('role')
  async createNewRole(@Body() roleDetails: CreateRoleDetails) {
    const role = await this.rolesService.createRole(roleDetails);

    return classToPlain(role);
  }

  @Scope(PermissionsPermission.Create)
  @Post('permission')
  async createNewPermission(@Body() permissionDetails: CreatePermissionDto) {
    const permission = await this.rolesService.createPermission(
      plainToClass(CreatePermissionDto, permissionDetails),
    );

    return classToPlain(permission);
  }

  @Scope(RolesPermission.View)
  @Get('role/:id?')
  async getRole(@Param() { id }: FetchDto) {
    if (id) {
      const role = await this.rolesService.getRoleById(id);
      return classToPlain(role);
    }

    const roles = await this.rolesService.getAllRoles();

    return classToPlain(roles);
  }

  @Scope(PermissionsPermission.View)
  @Get('permission/:id?')
  async getPermission(@Param() { id }: FetchDto) {
    if (id) {
      const permission = await this.rolesService.getPermissionById(id);
      return classToPlain(permission);
    }

    const permissions = await this.rolesService.getAllPermissions();

    return classToPlain(permissions);
  }

  @Scope(RolesPermission.Update)
  @Put('role/:id')
  async updateRole(
    @Param() { id }: UpdateParamDto,
    @Body() updateRoleBody: UpdateRoleDto,
  ) {
    const updatedRole = await this.rolesService.updateRole(id, updateRoleBody);
    return classToPlain(updatedRole);
  }

  @Scope(PermissionsPermission.Update)
  @Put('permission/:id')
  async updatePermission(
    @Param() { id }: UpdateParamDto,
    @Body() updatePermissionBody: UpdatePermissionDto,
  ) {
    const updatedPermission = await this.rolesService.updatePermission(
      id,
      updatePermissionBody,
    );
    return classToPlain(updatedPermission);
  }

  @Scope(RolesPermission.Delete)
  @Patch('role/:id')
  async deleteRolePermissions(
    @Param() { id }: UpdateParamDto,
    @Body() updateRole: DeleteRolePermissionDto,
  ) {
    const updatedRole = await this.rolesService.deleteRolePermissions(
      id,
      updateRole.permissions,
    );

    return classToPlain(updatedRole);
  }

  @Scope(RolesPermission.Delete)
  @Delete('role/:id')
  async deleteRole(@Param() { id }: DeleteParamDto) {
    return await this.rolesService.deleteRole(id);
  }

  @Scope(PermissionsPermission.Delete)
  @Delete('permission/:id')
  async deletePermission(@Param() { id }: DeleteParamDto) {
    return await this.rolesService.deletePermission(id);
  }

  @Scope(RolesPermission.Update)
  @Put('role/default')
  async setDefaultRole(@Body() { id }: UpdateParamDto) {
    return classToPlain(await this.rolesService.selectDefaultRole(id));
  }
}
