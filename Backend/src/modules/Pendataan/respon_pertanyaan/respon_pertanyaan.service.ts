import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import { CodeManagementService } from '../../Pengaturan/code_management/code_management.service';

type ResponseItem = { id_pertanyaan: number; skor_poin: number };

@Injectable()
export class ResponPertanyaanService {
  private pool: Pool;

  constructor(private readonly codeManagementService: CodeManagementService) {
    const isProduction = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');
    
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      ...(isProduction && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      connectTimeout: 20000,
    });
  }

  async submitResponses(code: string, items: ResponseItem[]) {
    if (!code || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('code dan daftar jawaban wajib diisi');
    }
    const validation =
      await this.codeManagementService.validateAndConsume(code);
    const id_pelajar = validation.id_pelajar;

    for (const it of items) {
      if (
        it == null ||
        typeof it.id_pertanyaan !== 'number' ||
        typeof it.skor_poin !== 'number'
      ) {
        throw new BadRequestException('Format jawaban tidak valid');
      }
      if (it.skor_poin < 1 || it.skor_poin > 5) {
        throw new BadRequestException('Skor di luar rentang 1-5');
      }
      await this.pool.execute(
        'INSERT INTO respon (id_pelajar, id_pertanyaan, skor_poin) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE skor_poin = VALUES(skor_poin)',
        [id_pelajar, it.id_pertanyaan, it.skor_poin],
      );
    }

    const result = await this.computeAndSaveSurvey(id_pelajar);
    await this.codeManagementService.finish(code);

    return result;
  }

  async findOneResult(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT h.id AS id_hasil,
              h.id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              s.nama_sekolah,
              kl.nama_kelas,
              h.total_skor,
              h.level_sdness,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       WHERE h.id_pelajar = ?
       LIMIT 1`,
      [id_pelajar],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          id_hasil: number;
          id_pelajar: number;
          nama_pelajar: string;
          nomor_absen: string;
          nama_sekolah: string;
          nama_kelas: string;
          total_skor: number;
          level_sdness: string;
          diselesaikan_pada: Date | null;
        })
      | undefined;
    if (!row) {
      throw new BadRequestException('Hasil tidak ditemukan');
    }
    return {
      id_hasil: row.id_hasil,
      id_pelajar: row.id_pelajar,
      nama_pelajar: row.nama_pelajar,
      nomor_absen: row.nomor_absen,
      nama_sekolah: row.nama_sekolah,
      nama_kelas: row.nama_kelas,
      total_skor: row.total_skor,
      level_sdness: row.level_sdness,
      diselesaikan_pada: row.diselesaikan_pada,
    };
  }

  async findAllResults(filter: {
    id_sekolah?: number;
    id_kelas?: number;
    nama?: string;
  }) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.id_sekolah) {
      conditions.push('s.id = ?');
      params.push(filter.id_sekolah);
    }
    if (filter.id_kelas) {
      conditions.push('kl.id = ?');
      params.push(filter.id_kelas);
    }
    if (filter.nama) {
      conditions.push('p.nama_pelajar LIKE ?');
      params.push(`%${filter.nama}%`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT h.id AS id_hasil,
              h.id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              s.nama_sekolah,
              kl.nama_kelas,
              h.total_skor,
              h.level_sdness,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       ${whereClause}
       ORDER BY h.diselesaikan_pada DESC`,
      params,
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & {
        id_hasil: number;
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        nama_sekolah: string;
        nama_kelas: string;
        total_skor: number;
        level_sdness: string;
        diselesaikan_pada: Date | null;
      };
      return {
        id_hasil: row.id_hasil,
        id_pelajar: row.id_pelajar,
        nama_pelajar: row.nama_pelajar,
        nomor_absen: row.nomor_absen,
        nama_sekolah: row.nama_sekolah,
        nama_kelas: row.nama_kelas,
        total_skor: row.total_skor,
        level_sdness: row.level_sdness,
        diselesaikan_pada: row.diselesaikan_pada,
      };
    });
  }

  async computeAndSaveSurvey(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT SUM(skor_poin) AS total, COUNT(*) AS cnt FROM respon WHERE id_pelajar = ?',
      [id_pelajar],
    );
    const agg = rows[0] as RowDataPacket & {
      total: number | null;
      cnt: number;
    };
    if (!agg || agg.total == null || agg.cnt === 0) {
      throw new BadRequestException('Belum ada jawaban untuk dihitung');
    }
    if (agg.cnt !== 60) {
      throw new BadRequestException(
        'Jawaban belum lengkap, 60 pertanyaan harus terisi',
      );
    }
    const total_skor = agg.total;
    let level_sdness: 'Low' | 'Moderate' | 'High';
    if (total_skor >= 60 && total_skor <= 140) {
      level_sdness = 'Low';
    } else if (total_skor >= 141 && total_skor <= 220) {
      level_sdness = 'Moderate';
    } else {
      level_sdness = 'High';
    }
    await this.pool.execute(
      'INSERT INTO hasil_survey (id_pelajar, total_skor, level_sdness) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE total_skor = VALUES(total_skor), level_sdness = VALUES(level_sdness), diselesaikan_pada = CURRENT_TIMESTAMP',
      [id_pelajar, total_skor, level_sdness],
    );
    return { id_pelajar, total_skor, level_sdness };
  }
}
