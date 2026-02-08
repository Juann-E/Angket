import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

type ScopeIds = {
  id_sekolah?: number;
  id_kejuruan?: number;
  id_kelas?: number;
};

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
    scope: ScopeIds,
  ) {
    const [res] = await this.pool.execute(
      'INSERT INTO pertanyaan (isi_pertanyaan, tipe_soal, bobot_persentase) VALUES (?, ?, ?)',
      [isi_pertanyaan, 'pilihan_ganda', bobot_persentase],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    await this.pool.execute(
      'INSERT INTO pertanyaan_scope (id_pertanyaan, id_sekolah, id_kejuruan, id_kelas) VALUES (?, ?, ?, ?)',
      [
        insertId,
        scope.id_sekolah ?? null,
        scope.id_kejuruan ?? null,
        scope.id_kelas ?? null,
      ],
    );
    return { id: insertId };
  }

  async findAll(filter: ScopeIds) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (filter.id_sekolah) {
      conditions.push('ps.id_sekolah = ?');
      params.push(filter.id_sekolah);
    }
    if (filter.id_kejuruan) {
      conditions.push('ps.id_kejuruan = ?');
      params.push(filter.id_kejuruan);
    }
    if (filter.id_kelas) {
      conditions.push('ps.id_kelas = ?');
      params.push(filter.id_kelas);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await this.pool.query(
      `SELECT p.id, p.isi_pertanyaan, p.tipe_soal, p.bobot_persentase, ps.id_sekolah, ps.id_kejuruan, ps.id_kelas
       FROM pertanyaan p
       LEFT JOIN pertanyaan_scope ps ON ps.id_pertanyaan = p.id
       ${where}
       ORDER BY p.id DESC`,
      params,
    );
    return rows as Array<{
      id: number;
      isi_pertanyaan: string;
      tipe_soal: string;
      bobot_persentase: number;
      id_sekolah: number | null;
      id_kejuruan: number | null;
      id_kelas: number | null;
    }>;
  }

  async update(
    id: number,
    payload: { isi_pertanyaan?: string; bobot_persentase?: number },
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
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    const [res] = await this.pool.execute(
      `UPDATE pertanyaan SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }

  async remove(id: number) {
    await this.pool.execute(
      'DELETE FROM pertanyaan_scope WHERE id_pertanyaan = ?',
      [id],
    );
    const [res] = await this.pool.execute(
      'DELETE FROM pertanyaan WHERE id = ?',
      [id],
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
