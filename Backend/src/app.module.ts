import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PertanyaanModule } from './modules/pertanyaan/pertanyaan.module';
import { SekolahModule } from './modules/sekolah/sekolah.module';
import { KejuruanModule } from './modules/kejuruan/kejuruan.module';
import { KelasModule } from './modules/kelas/kelas.module';
import { AngkatanModule } from './modules/angkatan/angkatan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PertanyaanModule,
    SekolahModule,
    KejuruanModule,
    KelasModule,
    AngkatanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
