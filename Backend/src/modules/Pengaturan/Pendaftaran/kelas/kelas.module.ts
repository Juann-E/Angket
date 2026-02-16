import { Module } from '@nestjs/common';
import { KelasService } from './kelas.service';
import { KelasController } from './kelas.controller';
import { AuthModule } from '../../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [KelasService],
  controllers: [KelasController],
  exports: [KelasService],
})
export class KelasModule {}
