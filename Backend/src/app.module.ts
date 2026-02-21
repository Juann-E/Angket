import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PertanyaanModule } from './modules/Pendataan/Pertanyaan/pertanyaan.module';
import { SekolahModule } from './modules/Pengaturan/Pendaftaran/sekolah/sekolah.module';
import { KejuruanModule } from './modules/Pengaturan/Pendaftaran/kejuruan/kejuruan.module';
import { KelasModule } from './modules/Pengaturan/Pendaftaran/kelas/kelas.module';
import { PelajarRegisModule } from './modules/Pengaturan/Pendaftaran/pelajar_regis/pelajar_regis.module';
import { CodeManagementModule } from './modules/Pengaturan/code_management/code_management.module';
import { AccountManagementModule } from './modules/Pengaturan/account_management/account_management.module';
import { ResponPertanyaanModule } from './modules/Pendataan/respon_pertanyaan/respon_pertanyaan.module';
import { ExportHasilModule } from './modules/Pendataan/Export_hasil/export_hasil.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PertanyaanModule,
    SekolahModule,
    KejuruanModule,
    KelasModule,
    PelajarRegisModule,
    CodeManagementModule,
    AccountManagementModule,
    ResponPertanyaanModule,
    ExportHasilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
