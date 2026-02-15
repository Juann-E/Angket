import { Module } from '@nestjs/common';
import { PelajarRegisService } from './pelajar_regis.service';
import { PelajarRegisController } from './pelajar_regis.controller';

@Module({
  controllers: [PelajarRegisController],
  providers: [PelajarRegisService],
  exports: [PelajarRegisService],
})
export class PelajarRegisModule {}
