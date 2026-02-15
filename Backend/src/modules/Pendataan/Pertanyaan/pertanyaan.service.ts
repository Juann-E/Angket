import { Injectable, BadRequestException } from '@nestjs/common';
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
    kategori: string,
    scope: ScopeIds,
  ) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (scope.id_sekolah === undefined) {
      throw new BadRequestException('id_sekolah wajib diisi');
    }
    conditions.push('ps.id_sekolah = ?');
    params.push(scope.id_sekolah);
    if (scope.id_kelas !== undefined) {
      conditions.push('ps.id_kejuruan = ?');
      params.push(scope.id_kejuruan ?? null);
      conditions.push('ps.id_kelas = ?');
      params.push(scope.id_kelas);
    } else if (scope.id_kejuruan !== undefined) {
      conditions.push('ps.id_kejuruan = ?');
      params.push(scope.id_kejuruan);
      conditions.push('ps.id_kelas IS NULL');
    } else {
      conditions.push('ps.id_kejuruan IS NULL');
      conditions.push('ps.id_kelas IS NULL');
    }
    const where = conditions.join(' AND ');
    const [countRows] = await this.pool.query(
      `SELECT COUNT(*) AS cnt
       FROM pertanyaan_scope ps
       WHERE ${where}`,
      params,
    );
    const cnt = (countRows as Array<{ cnt: number }>)[0]?.cnt ?? 0;
    if (cnt >= 60) {
      throw new BadRequestException(
        'Kuota 60 pertanyaan untuk cakupan ini sudah terpenuhi',
      );
    }

    const [res] = await this.pool.execute(
      'INSERT INTO pertanyaan (isi_pertanyaan, kategori, tipe_soal, bobot_persentase) VALUES (?, ?, ?, ?)',
      [isi_pertanyaan, kategori, 'pilihan_ganda', bobot_persentase],
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
      `SELECT p.id, p.isi_pertanyaan, p.kategori, p.tipe_soal, p.bobot_persentase, 
              ps.id_sekolah, s.nama_sekolah,
              ps.id_kejuruan, k.nama_kejuruan,
              ps.id_kelas, kl.nama_kelas
       FROM pertanyaan p
       LEFT JOIN pertanyaan_scope ps ON ps.id_pertanyaan = p.id
       LEFT JOIN sekolah s ON s.id = ps.id_sekolah
       LEFT JOIN kejuruan k ON k.id = ps.id_kejuruan
       LEFT JOIN kelas kl ON kl.id = ps.id_kelas
       ${where}
       ORDER BY p.id DESC`,
      params,
    );

    return rows as Array<{
      id: number;
      isi_pertanyaan: string;
      kategori: string;
      tipe_soal: string;
      bobot_persentase: number;
      id_sekolah: number | null;
      nama_sekolah: string | null;
      id_kejuruan: number | null;
      nama_kejuruan: string | null;
      id_kelas: number | null;
      nama_kelas: string | null;
    }>;
  }

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT p.id, p.isi_pertanyaan, p.kategori, p.tipe_soal, p.bobot_persentase,
              ps.id_sekolah, s.nama_sekolah,
              ps.id_kejuruan, k.nama_kejuruan,
              ps.id_kelas, kl.nama_kelas
       FROM pertanyaan p
       LEFT JOIN pertanyaan_scope ps ON ps.id_pertanyaan = p.id
       LEFT JOIN sekolah s ON s.id = ps.id_sekolah
       LEFT JOIN kejuruan k ON k.id = ps.id_kejuruan
       LEFT JOIN kelas kl ON kl.id = ps.id_kelas
       WHERE p.id = ?
       LIMIT 1`,
      [id],
    );
    const list = rows as Array<{
      id: number;
      isi_pertanyaan: string;
      kategori: string;
      tipe_soal: string;
      bobot_persentase: number;
      id_sekolah: number | null;
      nama_sekolah: string | null;
      id_kejuruan: number | null;
      nama_kejuruan: string | null;
      id_kelas: number | null;
      nama_kelas: string | null;
    }>;
    return list[0] ?? null;
  }

  async update(
    id: number,
    payload: {
      isi_pertanyaan?: string;
      bobot_persentase?: number;
      kategori?: string;
      id_sekolah?: number;
      id_kejuruan?: number;
      id_kelas?: number;
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

    // Update scope if provided
    if (
      payload.id_sekolah !== undefined ||
      payload.id_kejuruan !== undefined ||
      payload.id_kelas !== undefined
    ) {
      const scopeFields: string[] = [];
      const scopeParams: any[] = [];
      if (payload.id_sekolah !== undefined) {
        scopeFields.push('id_sekolah = ?');
        scopeParams.push(payload.id_sekolah);
      }
      if (payload.id_kejuruan !== undefined) {
        scopeFields.push('id_kejuruan = ?');
        scopeParams.push(payload.id_kejuruan);
      }
      if (payload.id_kelas !== undefined) {
        scopeFields.push('id_kelas = ?');
        scopeParams.push(payload.id_kelas);
      }

      scopeParams.push(id);
      await this.pool.execute(
        `UPDATE pertanyaan_scope SET ${scopeFields.join(', ')} WHERE id_pertanyaan = ?`,
        scopeParams,
      );
    }

    return { success: true };
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
