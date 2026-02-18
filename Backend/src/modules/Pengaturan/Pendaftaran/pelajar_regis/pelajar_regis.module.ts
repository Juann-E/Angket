import { Module } from '@nestjs/common';
import { PelajarRegisService } from './pelajar_regis.service';
import { PelajarRegisController } from './pelajar_regis.controller';
import { CodeManagementModule } from '../../code_management/code_management.module';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [CodeManagementModule, AuthModule],
  controllers: [PelajarRegisController],
  providers: [PelajarRegisService],
  exports: [PelajarRegisService],
})
export class PelajarRegisModule {}
