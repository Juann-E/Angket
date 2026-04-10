import {
  Controller, Get, Post, Body, Delete,
  Param, Patch, NotFoundException, UseGuards,
} from '@nestjs/common';
import { SekolahService } from './sekolah.service';
import { CreateSekolahDto } from './dto/create-sekolah.dto';
import { UpdateSekolahDto } from './dto/update-sekolah.dto';
import { Roles } from '../../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles.guard';

@Controller('sekolah')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SekolahController {
  constructor(private readonly service: SekolahService) { }

  @Post()
  @Roles('super_admin')
  async create(@Body() dto: CreateSekolahDto) {
    return this.service.create(dto.nama_sekolah);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(Number(id));
    if (!item) throw new NotFoundException('Sekolah tidak ditemukan');
    return item;
  }

  @Patch(':id')
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() dto: UpdateSekolahDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles('super_admin')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
