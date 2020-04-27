import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UseInterceptors,
  NotFoundException,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserService } from '@/modules/user/user.service';
import { ResponseTransformInterceptor } from '@/utils/response-transform.interceptor';

import {
  CreateUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './validation.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { EmailService } from '../email/email.service';
import { PasswordResetService } from '../password-reset/password-reset.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('register')
  async register(@Req() request: Request, @Body() userData: CreateUserDto) {
    const user = await this.userService.createUser(userData);

    const endpoint = `/auth/verify/${this.userService.encode(user.id)}`;
    const fullUrl = request.protocol + '://' + request.get('host') + endpoint;

    await this.emailService.sendMail({
      kind: 'confirmation-email',
      receiver: user.email,
      confirmationUrl: fullUrl,
    });

    return classToPlain(user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.userService.findByEmail(req.user.email);
    return classToPlain(user);
  }

  @Post('reset-request')
  async requestPasswordReset(@Body() detail: RequestPasswordResetDto) {
    const user = await this.userService.findByEmail(detail.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const otp = Math.floor((Math.random() / Math.random()) * 100000).toString();

    this.emailService.sendMail({
      kind: 'password-reset',
      otp,
      receiver: user.email,
    });

    await this.passwordResetService.savePasswordResetRequest(user.email, otp);

    return { email: user.email };
  }

  @Put('reset-password')
  async resetPassword(@Body() resetInfo: ResetPasswordDto) {
    const user = await this.userService.findByEmail(resetInfo.email);

    if (!user) {
      throw new NotFoundException('invalid password reset request');
    }

    const request = await this.passwordResetService.getValidPasswordRequest(
      user.email,
      resetInfo.code,
    );

    await user.setPassword(resetInfo.password);
    this.userService.updateUser(user);

    request.valid = false;
    this.passwordResetService.updatePasswordResetRequest(request);

    return { email: user.email };
  }
}
