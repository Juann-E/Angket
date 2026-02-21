import { Module } from '@nestjs/common';
import { ExportHasilService } from './export_hasil.service';
import { ExportHasilController } from './export_hasil.controller';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ExportHasilService],
  controllers: [ExportHasilController],
  exports: [ExportHasilService],
})
export class ExportHasilModule {}
