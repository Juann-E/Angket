import { Controller, Post, Body } from '@nestjs/common';
import { ResponPertanyaanService } from './respon_pertanyaan.service';

class SubmitDto {
  id_pelajar!: number;
  items!: Array<{ id_pertanyaan: number; skor_poin: number }>;
}

@Controller('pendataan/respon_pertanyaan')
export class ResponPertanyaanController {
  constructor(private readonly service: ResponPertanyaanService) {}

  @Post('submit')
  async submit(@Body() dto: SubmitDto) {
    return this.service.submitResponses(dto.id_pelajar, dto.items);
  }
}
