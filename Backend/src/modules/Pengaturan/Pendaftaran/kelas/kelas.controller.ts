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
  UseGuards,
} from '@nestjs/common';
import { KelasService } from './kelas.service';
import { CreateKelasDto } from './dto/create-kelas.dto';
import { UpdateKelasDto } from './dto/update-kelas.dto';
import { Roles } from '../../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles.guard';

@Controller('kelas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KelasController {
  constructor(private readonly service: KelasService) {}

  @Post()
  @Roles('super_admin')
  async create(@Body() dto: CreateKelasDto) {
    return this.service.create(dto.id_kejuruan, dto.nama_kelas);
  }

  @Get()
  async findAll(@Query('id_kejuruan') id_kejuruan?: string) {
    return this.service.findAll({
      id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.service.findOne(Number(id));
    if (!item) throw new NotFoundException('Kelas tidak ditemukan');
    return item;
  }

  @Patch(':id')
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() dto: UpdateKelasDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles('super_admin')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
