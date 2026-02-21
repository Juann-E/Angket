export class UpdatePertanyaanDto {
  isi_pertanyaan?: string;
  bobot_persentase?: number;
  kategori?:
    | 'Awareness'
    | 'Learning strategies'
    | 'Learning activities'
    | 'Evaluation'
    | 'Interpersonal skills';
}
