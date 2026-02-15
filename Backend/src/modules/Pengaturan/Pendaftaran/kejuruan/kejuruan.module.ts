import { Module } from '@nestjs/common';
import { KejuruanService } from './kejuruan.service';
import { KejuruanController } from './kejuruan.controller';

@Module({
  providers: [KejuruanService],
  controllers: [KejuruanController],
  exports: [KejuruanService],
})
export class KejuruanModule {}
