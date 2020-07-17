import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { RolesController } from './roles.controller';
import { rolesProviders } from './roles.provider';
import { RolesService } from './roles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [...rolesProviders, RolesService],
  exports: [...rolesProviders, RolesService],
})
export class RolesModule {}
