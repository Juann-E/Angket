import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class SekolahService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async create(nama_sekolah: string) {
    const [res] = await this.pool.execute(
      'INSERT INTO sekolah (nama_sekolah) VALUES (?)',
      [nama_sekolah],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId };
  }

  async findAll() {
    const [rows] = await this.pool.query(
      'SELECT id, nama_sekolah FROM sekolah ORDER BY id DESC',
    );
    return rows as Array<{ id: number; nama_sekolah: string }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      'SELECT id, nama_sekolah FROM sekolah WHERE id = ? LIMIT 1',
      [id],
    );
    const list = rows as Array<{ id: number; nama_sekolah: string }>;
    return list[0] ?? null;
  }

  async update(id: number, payload: { nama_sekolah?: string }) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.nama_sekolah !== undefined) {
      fields.push('nama_sekolah = ?');
      params.push(payload.nama_sekolah);
    }
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    const [res] = await this.pool.execute(
      `UPDATE sekolah SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }

  async remove(id: number) {
    const [res] = await this.pool.execute('DELETE FROM sekolah WHERE id = ?', [
      id,
    ]);
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
