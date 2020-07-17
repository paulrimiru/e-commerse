import { User } from '@/entities/user.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: User = request.user;

    if (user.verified && this.hasPerm(user, permission)) {
      return true;
    }

    throw new UnauthorizedException('user does not have the required roles');
  }

  hasPerm(user: User, perm: string) {
    if (!user.role) {
      return false;
    }

    const isUserAuthorised = !!user.role.permissions.find(
      ({ permission }) => perm === permission.name,
    );

    return isUserAuthorised;
  }
}
