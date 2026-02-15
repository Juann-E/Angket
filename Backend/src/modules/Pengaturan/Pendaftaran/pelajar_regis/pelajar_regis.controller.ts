import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PelajarRegisService } from './pelajar_regis.service';

class RegisterPelajarDto {
  id_kelas!: number;
  nama_pelajar!: string;
  nomor_absen!: string;
}

@Controller('pengaturan/pelajar_regis')
export class PelajarRegisController {
  constructor(private readonly service: PelajarRegisService) {}

  @Get('sekolah')
  async sekolah() {
    return this.service.listSekolah();
  }

  @Get('kejuruan')
  async kejuruan(@Query('id_sekolah') id_sekolah: string) {
    return this.service.listKejuruan(Number(id_sekolah));
  }

  @Get('kelas')
  async kelas(@Query('id_kejuruan') id_kejuruan: string) {
    return this.service.listKelas(Number(id_kejuruan));
  }

  @Post('register')
  async register(@Body() dto: RegisterPelajarDto) {
    return this.service.registerPelajar(
      dto.id_kelas,
      dto.nama_pelajar,
      dto.nomor_absen,
    );
  }
}
