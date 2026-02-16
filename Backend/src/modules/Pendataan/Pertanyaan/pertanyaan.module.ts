import { Module } from '@nestjs/common';
import { PertanyaanService } from './pertanyaan.service';
import { PertanyaanController } from './pertanyaan.controller';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PertanyaanService],
  controllers: [PertanyaanController],
  exports: [PertanyaanService],
})
export class PertanyaanModule {}
