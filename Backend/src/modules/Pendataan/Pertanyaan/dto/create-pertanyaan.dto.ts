export class CreatePertanyaanDto {
  isi_pertanyaan: string;
  bobot_persentase?: number;
  kategori:
    | 'Awareness'
    | 'Learning strategies'
    | 'Learning activities'
    | 'Evaluation'
    | 'Interpersonal skills';
  id_sekolah: number;
  id_kejuruan?: number;
  id_kelas?: number;
}
