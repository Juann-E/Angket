import { Module } from '@nestjs/common';
import { AngkatanService } from './angkatan.service';
import { AngkatanController } from './angkatan.controller';

@Module({
  providers: [AngkatanService],
  controllers: [AngkatanController],
  exports: [AngkatanService],
})
export class AngkatanModule {}
