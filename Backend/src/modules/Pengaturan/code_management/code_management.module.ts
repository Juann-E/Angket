import { Module } from '@nestjs/common';
import { CodeManagementService } from './code_management.service';
import { CodeManagementController } from './code_management.controller';

@Module({
  controllers: [CodeManagementController],
  providers: [CodeManagementService],
  exports: [CodeManagementService],
})
export class CodeManagementModule {}
