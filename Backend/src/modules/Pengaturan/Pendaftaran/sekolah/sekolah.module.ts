import { Module } from '@nestjs/common';
import { SekolahService } from './sekolah.service';
import { SekolahController } from './sekolah.controller';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SekolahService],
  controllers: [SekolahController],
  exports: [SekolahService],
})
export class SekolahModule {}
