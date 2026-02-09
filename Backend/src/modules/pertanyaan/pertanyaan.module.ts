import { Module } from '@nestjs/common';
import { PertanyaanService } from './pertanyaan.service';
import { PertanyaanController } from './pertanyaan.controller';

@Module({
  providers: [PertanyaanService],
  controllers: [PertanyaanController],
  exports: [PertanyaanService],
})
export class PertanyaanModule {}
