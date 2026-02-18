export class SubmitResponDto {
  code!: string;
  items!: Array<{ id_pertanyaan: number; skor_poin: number }>;
}

export class FindResultsFilterDto {
  id_sekolah?: string;
  id_kelas?: string;
  nama?: string;
}
