export class GenerateDto {
  id_pelajar!: number;
}

export class ValidateDto {
  code!: string;
}

export class FinishDto {
  code!: string;
}

export class SubmitResponseDto {
  code!: string;
  id_pertanyaan!: number;
  skor_poin!: number;
}
