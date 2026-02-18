import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PertanyaanService } from './pertanyaan.service';
import { CreatePertanyaanDto } from './dto/create-pertanyaan.dto';
import { UpdatePertanyaanDto } from './dto/update-pertanyaan.dto';
import { Roles } from '../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';

@Controller('pertanyaan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PertanyaanController {
  constructor(private readonly service: PertanyaanService) {}

  @Post()
  @Roles('super_admin')
  async create(@Body() dto: CreatePertanyaanDto) {
    return this.service.create(
      dto.isi_pertanyaan,
      dto.bobot_persentase ?? 1.0,
      dto.kategori,
    );
  }

  @Get()
  async findAll() {
    return this.service.findAll();
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
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() dto: UpdatePertanyaanDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles('super_admin')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
