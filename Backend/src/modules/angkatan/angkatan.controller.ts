import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AngkatanService } from './angkatan.service';
import { CreateAngkatanDto } from './dto/create-angkatan.dto';
import { UpdateAngkatanDto } from './dto/update-angkatan.dto';

@Controller('angkatan')
export class AngkatanController {
  constructor(private readonly service: AngkatanService) {}

  @Post()
  async create(@Body() dto: CreateAngkatanDto) {
    return this.service.create(dto.id_sekolah, dto.tahun_angkatan);
  }

  @Get()
  async findAll(@Query('id_sekolah') id_sekolah?: string) {
    return this.service.findAll({
      id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(Number(id));
    if (!item) throw new NotFoundException('Angkatan tidak ditemukan');
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAngkatanDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
