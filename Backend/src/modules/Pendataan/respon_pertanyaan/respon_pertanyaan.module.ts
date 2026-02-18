import { Module } from '@nestjs/common';
import { ResponPertanyaanService } from './respon_pertanyaan.service';
import { ResponPertanyaanController } from './respon_pertanyaan.controller';
import { AuthModule } from '../../../auth/auth.module';
import { CodeManagementModule } from '../../Pengaturan/code_management/code_management.module';

@Module({
  imports: [AuthModule, CodeManagementModule],
  controllers: [ResponPertanyaanController],
  providers: [ResponPertanyaanService],
  exports: [ResponPertanyaanService],
})
export class ResponPertanyaanModule {}
