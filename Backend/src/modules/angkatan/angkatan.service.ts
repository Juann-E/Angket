import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class AngkatanService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async create(id_sekolah: number, tahun_angkatan: number | string) {
    const year = this.normalizeYear(tahun_angkatan);
    const [res] = await this.pool.execute(
      'INSERT INTO angkatan (id_sekolah, tahun_angkatan) VALUES (?, ?)',
      [id_sekolah, year],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;
    return { id: insertId };
  }

  async findAll(filter?: { id_sekolah?: number }) {
    const where = filter?.id_sekolah ? 'WHERE id_sekolah = ?' : '';
    const params = filter?.id_sekolah ? [filter.id_sekolah] : [];
    const [rows] = await this.pool.query(
      `SELECT id, id_sekolah, tahun_angkatan FROM angkatan ${where} ORDER BY id DESC`,
      params,
    );
    return rows as Array<{
      id: number;
      id_sekolah: number;
      tahun_angkatan: number;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT a.id, a.id_sekolah, a.tahun_angkatan, s.nama_sekolah
       FROM angkatan a
       LEFT JOIN sekolah s ON s.id = a.id_sekolah
       WHERE a.id = ?
       LIMIT 1`,
      [id],
    );
    const list = rows as Array<{
      id: number;
      id_sekolah: number;
      tahun_angkatan: number;
      nama_sekolah: string | null;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: { id_sekolah?: number; tahun_angkatan?: number | string },
  ) {
    const fields: string[] = [];
    const params: any[] = [];
    if (payload.id_sekolah !== undefined) {
      fields.push('id_sekolah = ?');
      params.push(payload.id_sekolah);
    }
    if (payload.tahun_angkatan !== undefined) {
      fields.push('tahun_angkatan = ?');
      params.push(this.normalizeYear(payload.tahun_angkatan));
    }
    if (!fields.length) return { affectedRows: 0 };
    params.push(id);
    const [res] = await this.pool.execute(
      `UPDATE angkatan SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }

  private normalizeYear(input: number | string) {
    const n = typeof input === 'string' ? Number.parseInt(input, 10) : input;
    if (!Number.isInteger(n) || n < 1900 || n > 2300) {
      throw new BadRequestException(
        'tahun_angkatan harus berupa tahun yang valid',
      );
    }
    return n;
  }

  async remove(id: number) {
    const [res] = await this.pool.execute('DELETE FROM angkatan WHERE id = ?', [
      id,
    ]);
    return {
      affectedRows: (res as unknown as { affectedRows: number }).affectedRows,
    };
  }
}
