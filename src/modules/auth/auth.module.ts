import { PasswordResetModule } from '@/modules/password-reset/password-reset.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UserModule, PasswordResetModule, PassportModule, RolesModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
