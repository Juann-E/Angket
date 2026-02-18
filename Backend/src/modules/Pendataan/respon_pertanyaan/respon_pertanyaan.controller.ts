import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponPertanyaanService } from './respon_pertanyaan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Role } from '../../../auth/auth.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import {
  SubmitResponDto,
  FindResultsFilterDto,
} from './dto/respon_pertanyaan.dto';

@Controller('pendataan/respon_pertanyaan')
export class ResponPertanyaanController {
  constructor(
    private readonly service: ResponPertanyaanService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('submit')
  async submit(
    @Body() dto: SubmitResponDto,
    @Req()
    req: {
      headers: { authorization?: string | string[] };
    },
  ) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = await this.jwtService.verifyAsync<{ role: Role }>(token, {
        secret: this.configService.get<string>('JWT_SECRET') ?? 'changeme',
      });
      if (payload.role === 'admin' || payload.role === 'super_admin') {
        throw new ForbiddenException('Admin tidak boleh mengisi jawaban');
      }
    }
    return this.service.submitResponses(dto.code, dto.items);
  }

  @Get('result_one')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async resultOne(@Query('id_pelajar') id_pelajar: string) {
    return this.service.findOneResult(Number(id_pelajar));
  }

  @Get('results')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  async results(@Query() query: FindResultsFilterDto) {
    return this.service.findAllResults({
      id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
      id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
      nama: query.nama || undefined,
    });
  }
}
