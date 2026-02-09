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
import { KejuruanService } from './kejuruan.service';
import { CreateKejuruanDto } from './dto/create-kejuruan.dto';
import { UpdateKejuruanDto } from './dto/update-kejuruan.dto';

@Controller('kejuruan')
export class KejuruanController {
  constructor(private readonly service: KejuruanService) {}

  @Post()
  async create(@Body() dto: CreateKejuruanDto) {
    return this.service.create(dto.id_angkatan, dto.nama_kejuruan);
  }

  @Get()
  async findAll(@Query('id_angkatan') id_angkatan?: string) {
    return this.service.findAll({
      id_angkatan: id_angkatan ? Number(id_angkatan) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(Number(id));
    if (!item) throw new NotFoundException('Kejuruan tidak ditemukan');
    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateKejuruanDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
