import {
  Body, Controller,
  ForbiddenException, Post, Req,
} from '@nestjs/common';
import { ResponPertanyaanService } from './respon_pertanyaan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Role } from '../../../auth/auth.service';

class SubmitDto {
  id_pelajar!: number;
  items!: Array<{ id_pertanyaan: number; skor_poin: number }>;
}

@Controller('pendataan/respon_pertanyaan')
export class ResponPertanyaanController {
  constructor(
    private readonly service: ResponPertanyaanService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  @Post('submit')
  async submit(
    @Body() dto: SubmitDto,
    @Req()
    req: {
      headers: { authorization?: string | string[] };
    },
  ) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const payload = await this.jwtService.verifyAsync<{ role: Role }>(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET') ?? 'changeme',
          },
        );
        if (payload.role === 'admin' || payload.role === 'super_admin') {
          throw new ForbiddenException('Admin tidak boleh mengisi jawaban');
        }
      } catch {
        return this.service.submitResponses(dto.id_pelajar, dto.items);
      }
      return this.service.submitResponses(dto.id_pelajar, dto.items);
    }
  }
}
