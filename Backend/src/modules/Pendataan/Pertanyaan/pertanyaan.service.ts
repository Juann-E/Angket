import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class PertanyaanService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async create(
    isi_pertanyaan: string,
    bobot_persentase: number,
    kategori: string,
  ) {
    const [countRows] = await this.pool.query(
      'SELECT COUNT(*) AS cnt FROM pertanyaan',
    );
    const cnt = (countRows as Array<{ cnt: number }>)[0]?.cnt ?? 0;
    if (cnt >= 60) {
      throw new BadRequestException(
        'Kuota 60 pertanyaan global sudah terpenuhi',
      );
    }
    const [categoryRows] = await this.pool.query(
      'SELECT COUNT(*) AS cnt FROM pertanyaan WHERE kategori = ?',
      [kategori],
    );
    const categoryCnt = (categoryRows as Array<{ cnt: number }>)[0]?.cnt ?? 0;
    if (categoryCnt >= 12) {
      throw new BadRequestException(
        'Kuota 12 pertanyaan untuk kategori ini sudah terpenuhi',
      );
    }
    const [res] = await this.pool.execute(
      'INSERT INTO pertanyaan (isi_pertanyaan, kategori, tipe_soal, bobot_persentase) VALUES (?, ?, ?, ?)',
      [isi_pertanyaan, kategori, 'pilihan_ganda', bobot_persentase],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId };
  }

  async findAll() {
    const [rows] = await this.pool.query(
      `SELECT id,
              isi_pertanyaan,
              kategori,
              tipe_soal,
              bobot_persentase
       FROM pertanyaan
       ORDER BY id DESC`,
    );

    return rows as Array<{
      id: number;
      isi_pertanyaan: string;
      kategori: string;
      tipe_soal: string;
      bobot_persentase: number;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT id,
              isi_pertanyaan,
              kategori,
              tipe_soal,
              bobot_persentase
       FROM pertanyaan
       WHERE id = ?
       LIMIT 1`,
      [id],
    );
    const list = rows as Array<{
      id: number;
      isi_pertanyaan: string;
      kategori: string;
      tipe_soal: string;
      bobot_persentase: number;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: {
      isi_pertanyaan?: string;
      bobot_persentase?: number;
      kategori?: string;
    },
  ) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.isi_pertanyaan !== undefined) {
      fields.push('isi_pertanyaan = ?');
      params.push(payload.isi_pertanyaan);
    }
    if (payload.bobot_persentase !== undefined) {
      fields.push('bobot_persentase = ?');
      params.push(payload.bobot_persentase);
    }
    if (payload.kategori !== undefined) {
      fields.push('kategori = ?');
      params.push(payload.kategori);
    }

    if (fields.length) {
      params.push(id);
      await this.pool.execute(
        `UPDATE pertanyaan SET ${fields.join(', ')} WHERE id = ?`,
        params,
      );
    }

    return { success: true };
  }

  async remove(id: number) {
    const [res] = await this.pool.execute(
      'DELETE FROM pertanyaan WHERE id = ?',
      [id],
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
