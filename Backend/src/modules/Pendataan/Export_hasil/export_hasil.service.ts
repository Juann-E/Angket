import { Injectable } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import ExcelJS from 'exceljs';

type ExportFilter = {
  id_sekolah?: number;
  id_kejuruan?: number;
  id_kelas?: number;
  from?: Date;
  to?: Date;
};

@Injectable()
export class ExportHasilService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async generateExcel(filter: ExportFilter): Promise<Buffer> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.id_sekolah) {
      conditions.push('s.id = ?');
      params.push(filter.id_sekolah);
    }
    if (filter.id_kejuruan) {
      conditions.push('k.id = ?');
      params.push(filter.id_kejuruan);
    }
    if (filter.id_kelas) {
      conditions.push('kl.id = ?');
      params.push(filter.id_kelas);
    }
    if (filter.from) {
      conditions.push('h.diselesaikan_pada >= ?');
      params.push(filter.from);
    }
    if (filter.to) {
      conditions.push('h.diselesaikan_pada <= ?');
      params.push(filter.to);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT s.nama_sekolah,
              k.nama_kejuruan,
              kl.nama_kelas,
              p.nama_pelajar,
              p.nomor_absen,
              h.total_skor,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       ${whereClause}
       ORDER BY s.nama_sekolah,
                k.nama_kejuruan,
                kl.nama_kelas,
                p.nama_pelajar`,
      params,
    );

    const list = rows.map((r) => {
      const row = r as RowDataPacket & {
        nama_sekolah: string;
        nama_kejuruan: string;
        nama_kelas: string;
        nama_pelajar: string;
        nomor_absen: string;
        total_skor: number;
        diselesaikan_pada: Date | null;
      };
      return {
        nama_sekolah: row.nama_sekolah,
        nama_kejuruan: row.nama_kejuruan,
        nama_kelas: row.nama_kelas,
        nama_pelajar: row.nama_pelajar,
        nomor_absen: row.nomor_absen,
        total_skor: row.total_skor,
        diselesaikan_pada: row.diselesaikan_pada,
      };
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hasil Survey');

    const satuSekolah =
      filter.id_sekolah && list.length > 0 ? list[0].nama_sekolah : 'Semua';
    const satuKejuruan =
      filter.id_kejuruan && list.length > 0 ? list[0].nama_kejuruan : 'Semua';
    const satuKelas =
      filter.id_kelas && list.length > 0 ? list[0].nama_kelas : 'Semua';

    sheet.addRow(['nama_sekolah']);
    sheet.addRow([satuSekolah]);
    sheet.addRow([]);
    sheet.addRow(['nama_kejuruan']);
    sheet.addRow([satuKejuruan]);
    sheet.addRow([]);
    sheet.addRow(['Nama_kelas']);
    sheet.addRow([satuKelas]);
    sheet.addRow([]);

    const avg =
      list.length > 0
        ? list.reduce((sum, it) => sum + it.total_skor, 0) / list.length
        : 0;
    sheet.addRow(['Rata_rata_total']);
    sheet.addRow([avg]);
    sheet.addRow([]);

    sheet.addRow([
      'Nama_Peserta',
      'nomor_absen',
      'Waktu_selesai',
      'Total_skor',
    ]);

    for (const item of list) {
      sheet.addRow([
        item.nama_pelajar,
        item.nomor_absen,
        item.diselesaikan_pada
          ? item.diselesaikan_pada.toISOString().replace('T', ' ').slice(0, 16)
          : '',
        item.total_skor,
      ]);
    }

    const buf = (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
    return buf;
  }
}
