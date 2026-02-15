import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PertanyaanService } from './pertanyaan.service';
import { CreatePertanyaanDto } from './dto/create-pertanyaan.dto';
import { UpdatePertanyaanDto } from './dto/update-pertanyaan.dto';

@Controller('pertanyaan')
export class PertanyaanController {
  constructor(private readonly service: PertanyaanService) {}

  @Post()
  async create(@Body() dto: CreatePertanyaanDto) {
    if (dto.id_sekolah === undefined || dto.id_sekolah === null) {
      throw new BadRequestException('id_sekolah wajib diisi');
    }
    return this.service.create(
      dto.isi_pertanyaan,
      dto.bobot_persentase ?? 1.0,
      dto.kategori,
      {
        id_sekolah: dto.id_sekolah,
        id_kejuruan: dto.id_kejuruan,
        id_kelas: dto.id_kelas,
      },
    );
  }

  @Get()
  async findAll(
    @Query('id_sekolah') id_sekolah?: string,
    @Query('id_kejuruan') id_kejuruan?: string,
    @Query('id_kelas') id_kelas?: string,
  ) {
    return this.service.findAll({
      id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
      id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
      id_kelas: id_kelas ? Number(id_kelas) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(Number(id));
    if (!item) {
      throw new NotFoundException('Pertanyaan tidak ditemukan');
    }
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePertanyaanDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
