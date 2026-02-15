import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

type ResponseItem = { id_pertanyaan: number; skor_poin: number };

@Injectable()
export class ResponPertanyaanService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async submitResponses(id_pelajar: number, items: ResponseItem[]) {
    if (!id_pelajar || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException(
        'id_pelajar dan daftar jawaban wajib diisi',
      );
    }
    const [pinRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT used FROM pin_code WHERE id_pelajar = ? LIMIT 1',
      [id_pelajar],
    );
    const pin = pinRows[0] as (RowDataPacket & { used: number }) | undefined;
    if (!pin || pin.used === 1) {
      throw new BadRequestException('Kode belum valid atau sudah selesai');
    }

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
    return this.computeAndSaveSurvey(id_pelajar);
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
    if (!agg || !agg.total || agg.cnt === 0) {
      throw new BadRequestException('Belum ada jawaban untuk dihitung');
    }
    const total_skor = Math.round(agg.total * 60);
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
