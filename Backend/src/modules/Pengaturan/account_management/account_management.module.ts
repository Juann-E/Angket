import { Module } from '@nestjs/common';
import { AccountManagementService } from './account_management.service';
import { AccountManagementController } from './account_management.controller';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AccountManagementService],
  controllers: [AccountManagementController],
  exports: [AccountManagementService],
})
export class AccountManagementModule {}
