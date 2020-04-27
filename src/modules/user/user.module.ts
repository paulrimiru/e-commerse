import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/modules/db/database.module';

import { UserService } from './user.service';
import { userProviders } from './user.provider';
import { UserController } from './user.controller';
import { EmailService } from '../email/email.service';
import { PasswordResetModule } from '@/modules/password-reset/password-reset.module';

@Module({
  imports: [DatabaseModule, PasswordResetModule],
  controllers: [UserController],
  providers: [...userProviders, UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
