import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { PASSWORD_RESET_REQUEST_REPOSITORY } from '@/modules/auth/constants';
import { PasswordResetRequests } from '@/entities/password-reset-requests.entity';
import { DATABASE_CONNECTION } from '@/utils/constants';

import { PasswordResetService } from './password-reset.service';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    PasswordResetService,
    {
      provide: PASSWORD_RESET_REQUEST_REPOSITORY,
      useFactory: (connection: Connection) =>
        connection.getRepository(PasswordResetRequests),
      inject: [DATABASE_CONNECTION],
    },
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
