import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PelajarRegisService } from './pelajar_regis.service';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles.guard';
import { Roles } from '../../../../auth/roles.decorator';

class RegisterPelajarDto {
  id_kelas!: number;
  nama_pelajar!: string;
  nomor_absen!: string;
}

class UpdatePelajarDto {
  id_kelas?: number;
  nama_pelajar?: string;
  nomor_absen?: string;
}

class FindAllFilterDto {
  nama?: string;
  id_sekolah?: string;
  id_kelas?: string;
}

class FindOneFilterDto {
  id_pelajar!: string;
  id_sekolah?: string;
  id_kejuruan?: string;
  id_kelas?: string;
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

  @Get('find_one')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async findOne(@Query() query: FindOneFilterDto) {
    return this.service.findOne({
      id_pelajar: Number(query.id_pelajar),
      id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
      id_kejuruan: query.id_kejuruan ? Number(query.id_kejuruan) : undefined,
      id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
    });
  }

  @Get('find_all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async findAll(@Query() query: FindAllFilterDto) {
    return this.service.findAll({
      nama: query.nama || undefined,
      id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
      id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async update(@Param('id') id: string, @Body() dto: UpdatePelajarDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
