import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class KejuruanService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async create(id_angkatan: number, nama_kejuruan: string) {
    const [res] = await this.pool.execute(
      'INSERT INTO kejuruan (id_angkatan, nama_kejuruan) VALUES (?, ?)',
      [id_angkatan, nama_kejuruan],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId };
  }

  async findAll(filter?: { id_angkatan?: number }) {
    const where = filter?.id_angkatan ? 'WHERE k.id_angkatan = ?' : '';
    const params = filter?.id_angkatan ? [filter.id_angkatan] : [];
    const [rows] = await this.pool.query(
      `SELECT k.id, k.id_angkatan, k.nama_kejuruan, a.tahun_angkatan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN angkatan a ON a.id = k.id_angkatan
       LEFT JOIN sekolah s ON s.id = a.id_sekolah
       ${where}
       ORDER BY k.id DESC`,
      params,
    );
    return rows as Array<{
      id: number;
      id_angkatan: number;
      nama_kejuruan: string;
      tahun_angkatan: number | null;
      nama_sekolah: string | null;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT k.id, k.id_angkatan, k.nama_kejuruan, a.tahun_angkatan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN angkatan a ON a.id = k.id_angkatan
       LEFT JOIN sekolah s ON s.id = a.id_sekolah
       WHERE k.id = ?
       LIMIT 1`,
      [id],
    );
    const list = rows as Array<{
      id: number;
      id_angkatan: number;
      nama_kejuruan: string;
      tahun_angkatan: number | null;
      nama_sekolah: string | null;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: { id_angkatan?: number; nama_kejuruan?: string },
  ) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.id_angkatan !== undefined) {
      fields.push('id_angkatan = ?');
      params.push(payload.id_angkatan);
    }
    if (payload.nama_kejuruan !== undefined) {
      fields.push('nama_kejuruan = ?');
      params.push(payload.nama_kejuruan);
    }
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    const [res] = await this.pool.execute(
      `UPDATE kejuruan SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }

  async remove(id: number) {
    const [res] = await this.pool.execute('DELETE FROM kejuruan WHERE id = ?', [
      id,
    ]);
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
