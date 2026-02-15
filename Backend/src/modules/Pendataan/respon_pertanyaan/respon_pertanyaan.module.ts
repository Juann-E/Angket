import { Module } from '@nestjs/common';
import { ResponPertanyaanService } from './respon_pertanyaan.service';
import { ResponPertanyaanController } from './respon_pertanyaan.controller';

@Module({
  controllers: [ResponPertanyaanController],
  providers: [ResponPertanyaanService],
  exports: [ResponPertanyaanService],
})
export class ResponPertanyaanModule {}
