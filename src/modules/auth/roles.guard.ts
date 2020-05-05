import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // if (!roles) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();

    // const user: User = request.user;
    // const hasRole = (role: string) => role === Role.Admin || roles.includes(role);

    // if (!user?.role || hasRole(user.role)) {
    //   throw new UnauthorizedException('user does not have the required roles');
    // }

    return true;
  }
}
