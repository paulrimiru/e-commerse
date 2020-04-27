import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '@/modules/user/user.service';
import { Role } from '@/entities/user.entity';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';

import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from '../user/validation.dto';

@UseInterceptors(ResponseTransformInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('auth/login')
  async login(@Body() credentials: LoginUserDto) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );

    if (!user) {
      throw new HttpException('user credentials invalid', HttpStatus.NOT_FOUND);
    }

    return await this.authService.generateToken(user);
  }

  @Get('auth/verify/:token')
  async verify(@Param('token') token: string) {
    const id = this.userService.decode(token);

    const user = await this.userService.findById(id);

    if (!user) {
      throw new BadRequestException('invalid token provided');
    }

    user.verified = true;
    user.role = Role.User;

    await this.userService.updateUser(user);

    return null;
  }
}
