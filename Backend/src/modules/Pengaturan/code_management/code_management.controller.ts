import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CodeManagementService } from './code_management.service';
import {
  GenerateDto,
  ValidateDto,
  FinishDto,
  SubmitResponseDto,
} from './dto/code_management.dto';

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

  @Post('finish')
  async finish(@Body() dto: FinishDto) {
    return this.service.finish(dto.code);
  }

  @Get('list')
  async getAllCodes() {
    return this.service.findAllCodes();
  }
}
