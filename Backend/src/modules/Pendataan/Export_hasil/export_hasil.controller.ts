import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ExportHasilService } from './export_hasil.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import type { Response } from 'express';

@Controller('pendataan/export_hasil')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportHasilController {
  constructor(private readonly service: ExportHasilService) {}

  @Get('excel')
  @Roles('super_admin', 'admin')
  async exportExcel(
    @Query('id_sekolah') id_sekolah?: string,
    @Query('id_kejuruan') id_kejuruan?: string,
    @Query('id_kelas') id_kelas?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Res() res?: Response,
  ) {
    const filter = {
      id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
      id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
      id_kelas: id_kelas ? Number(id_kelas) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    const buffer = await this.service.generateExcel(filter);

    if (res) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="hasil_survey.xlsx"',
      );
      res.send(buffer);
      return;
    }

    return buffer;
  }

  @Get('data')
  @Roles('super_admin', 'admin')
  async getExportData(
    @Query('id_sekolah') id_sekolah?: string,
    @Query('id_kejuruan') id_kejuruan?: string,
    @Query('id_kelas') id_kelas?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const filter = {
      id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
      id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
      id_kelas: id_kelas ? Number(id_kelas) : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };

    return this.service.getRawData(filter);
  }
}
