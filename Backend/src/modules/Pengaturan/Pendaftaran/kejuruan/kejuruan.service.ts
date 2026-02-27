import { Injectable } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class KejuruanService {
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

  async create(id_sekolah: number, nama_kejuruan: string) {
    const [res] = await this.pool.execute(
      'INSERT INTO kejuruan (id_sekolah, nama_kejuruan) VALUES (?, ?)',
      [id_sekolah, nama_kejuruan],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId, kejuruan: nama_kejuruan };
  }

  async findAll(filter?: { id_sekolah?: number }) {
    const where = filter?.id_sekolah ? 'WHERE k.id_sekolah = ?' : '';
    const params = filter?.id_sekolah ? [filter.id_sekolah] : [];
    const [rows] = await this.pool.query(
      `SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       ${where}
       ORDER BY k.id DESC`,
      params,
    );
    return rows as Array<{
      id: number;
      id_sekolah: number;
      nama_kejuruan: string;
      nama_sekolah: string | null;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       WHERE k.id = ?
       LIMIT 1`,
      [id],
    );
    const list = rows as Array<{
      id: number;
      id_sekolah: number;
      nama_kejuruan: string;
      nama_sekolah: string | null;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: { id_sekolah?: number; nama_kejuruan?: string },
  ) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.id_sekolah !== undefined) {
      fields.push('id_sekolah = ?');
      params.push(payload.id_sekolah);
    }
    if (payload.nama_kejuruan !== undefined) {
      fields.push('nama_kejuruan = ?');
      params.push(payload.nama_kejuruan);
    }
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    await this.pool.execute(
      `UPDATE kejuruan SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       WHERE k.id = ?`,
      [id],
    );
    const updated = rows[0] as unknown as
      | {
          id: number;
          id_sekolah: number;
          nama_kejuruan: string;
          nama_sekolah: string | null;
        }
      | undefined;
    return updated ?? { affectedRows: 0 };
  }

  async remove(id: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, nama_kejuruan FROM kejuruan WHERE id = ?',
      [id],
    );
    const current = rows[0] as unknown as
      | { id: number; nama_kejuruan: string }
      | undefined;
    if (!current) {
      return { affectedRows: 0 };
    }
    const [res] = await this.pool.execute('DELETE FROM kejuruan WHERE id = ?', [
      id,
    ]);
    return {
      id: current.id,
      nama_kejuruan: current.nama_kejuruan,
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
