import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class KelasService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async create(id_kejuruan: number, nama_kelas: string) {
    const [res] = await this.pool.execute(
      'INSERT INTO kelas (id_kejuruan, nama_kelas) VALUES (?, ?)',
      [id_kejuruan, nama_kelas],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId };
  }

  async findAll(filter?: { id_kejuruan?: number }) {
    const where = filter?.id_kejuruan ? 'WHERE id_kejuruan = ?' : '';
    const params = filter?.id_kejuruan ? [filter.id_kejuruan] : [];
    const [rows] = await this.pool.query(
      `SELECT id, id_kejuruan, nama_kelas FROM kelas ${where} ORDER BY id DESC`,
      params,
    );
    return rows as Array<{
      id: number;
      id_kejuruan: number;
      nama_kelas: string;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      'SELECT id, id_kejuruan, nama_kelas FROM kelas WHERE id = ? LIMIT 1',
      [id],
    );
    const list = rows as Array<{
      id: number;
      id_kejuruan: number;
      nama_kelas: string;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: { id_kejuruan?: number; nama_kelas?: string },
  ) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.id_kejuruan !== undefined) {
      fields.push('id_kejuruan = ?');
      params.push(payload.id_kejuruan);
    }
    if (payload.nama_kelas !== undefined) {
      fields.push('nama_kelas = ?');
      params.push(payload.nama_kelas);
    }
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    const [res] = await this.pool.execute(
      `UPDATE kelas SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }

  async remove(id: number) {
    const [res] = await this.pool.execute('DELETE FROM kelas WHERE id = ?', [
      id,
    ]);
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
