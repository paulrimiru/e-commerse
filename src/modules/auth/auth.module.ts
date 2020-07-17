import { PasswordResetModule } from '@/modules/password-reset/password-reset.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PasswordResetModule,
    PassportModule,
    RolesModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
