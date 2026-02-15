import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CodeManagementService } from './code_management.service';

class GenerateDto {
  id_pelajar!: number;
}
class ValidateDto {
  code!: string;
}
class FinishDto {
  code!: string;
}
class SubmitResponseDto {
  code!: string;
  id_pertanyaan!: number;
  skor_poin!: number;
}

@Controller('pengaturan/code_management')
export class CodeManagementController {
  constructor(private readonly service: CodeManagementService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDto) {
    return this.service.generateForPelajar(dto.id_pelajar);
  }

  @Post('validate')
  async validate(@Body() dto: ValidateDto) {
    return this.service.validateAndConsume(dto.code);
  }

  @Get('can_respond')
  async canRespond(@Query('id_pelajar') id_pelajar: string) {
    return { canRespond: await this.service.canRespond(Number(id_pelajar)) };
  }

  @Post('submit_response')
  async submitResponse(@Body() dto: SubmitResponseDto) {
    return this.service.submitSingleResponse(
      dto.code,
      dto.id_pertanyaan,
      dto.skor_poin,
    );
  }

  @Get('find_one')
  async findOne(@Query('id_pelajar') id_pelajar: string) {
    return this.service.findOneByPelajar(Number(id_pelajar));
  }

  @Post('finish')
  async finish(@Body() dto: FinishDto) {
    return this.service.finish(dto.code);
  }
}
