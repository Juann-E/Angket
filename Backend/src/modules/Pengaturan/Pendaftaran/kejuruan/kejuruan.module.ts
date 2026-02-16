import { Module } from '@nestjs/common';
import { KejuruanService } from './kejuruan.service';
import { KejuruanController } from './kejuruan.controller';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [KejuruanService],
  controllers: [KejuruanController],
  exports: [KejuruanService],
})
export class KejuruanModule {}
