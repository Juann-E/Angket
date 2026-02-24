import { Injectable } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class KelasService {
  private pool: Pool;

  constructor() {
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

  async create(id_kejuruan: number, nama_kelas: string) {
    const [res] = await this.pool.execute(
      'INSERT INTO kelas (id_kejuruan, nama_kelas) VALUES (?, ?)',
      [id_kejuruan, nama_kelas],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId, nama_kelas };
  }

  async findAll(filter?: { id_kejuruan?: number }) {
    const where = filter?.id_kejuruan ? 'WHERE k.id_kejuruan = ?' : '';
    const params = filter?.id_kejuruan ? [filter.id_kejuruan] : [];
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
       LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       ${where}
       ORDER BY k.id DESC`,
      params,
    );
    return rows as unknown as Array<{
      id: number;
      id_kejuruan: number;
      nama_kelas: string;
      nama_kejuruan: string | null;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
        LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       WHERE k.id = ? LIMIT 1`,
      [id],
    );
    const list = rows as unknown as Array<{
      id: number;
      id_kejuruan: number;
      nama_kelas: string;
      nama_kejuruan: string | null;
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
    await this.pool.execute(
      `UPDATE kelas SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
       LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       WHERE k.id = ?`,
      [id],
    );
    const updated = rows[0] as unknown as
      | {
          id: number;
          id_kejuruan: number;
          nama_kelas: string;
          nama_kejuruan: string | null;
        }
      | undefined;
    return updated ?? { affectedRows: 0 };
  }

  async remove(id: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, nama_kelas FROM kelas WHERE id = ?',
      [id],
    );
    const current = rows[0] as unknown as
      | { id: number; nama_kelas: string }
      | undefined;
    if (!current) {
      return { affectedRows: 0 };
    }
    const [res] = await this.pool.execute('DELETE FROM kelas WHERE id = ?', [
      id,
    ]);
    return {
      id: current.id,
      nama_kelas: current.nama_kelas,
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
