import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

type ScopeIds = {
  id_sekolah?: number;
  id_angkatan?: number;
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
    const [res] = await this.pool.execute(
      'INSERT INTO pertanyaan (isi_pertanyaan, kategori, tipe_soal, bobot_persentase) VALUES (?, ?, ?, ?)',
      [isi_pertanyaan, kategori, 'pilihan_ganda', bobot_persentase],
    );
    const insertId = (res as unknown as { insertId: number }).insertId;

    await this.pool.execute(
      'INSERT INTO pertanyaan_scope (id_pertanyaan, id_sekolah, id_angkatan, id_kejuruan, id_kelas) VALUES (?, ?, ?, ?, ?)',
      [
        insertId,
        scope.id_sekolah ?? null,
        scope.id_angkatan ?? null,
        scope.id_kejuruan ?? null,
        scope.id_kelas ?? null,
      ],
    );
    return { id: insertId };
  }

  async findAll(filter: ScopeIds) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (filter.id_sekolah) { conditions.push('ps.id_sekolah = ?'); params.push(filter.id_sekolah); }
    if (filter.id_angkatan) { conditions.push('ps.id_angkatan = ?'); params.push(filter.id_angkatan); }
    if (filter.id_kejuruan) { conditions.push('ps.id_kejuruan = ?'); params.push(filter.id_kejuruan); }
    if (filter.id_kelas) { conditions.push('ps.id_kelas = ?'); params.push(filter.id_kelas); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await this.pool.query(
      `SELECT p.id, p.isi_pertanyaan, p.kategori, p.tipe_soal, p.bobot_persentase, 
              ps.id_sekolah, ps.id_angkatan, ps.id_kejuruan, ps.id_kelas
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

  async findOne(id: number) {
    const [rows] = await this.pool.query(
      `SELECT p.id, p.isi_pertanyaan, p.kategori, p.tipe_soal, p.bobot_persentase,
              ps.id_sekolah, s.nama_sekolah,
              ps.id_angkatan, a.tahun_angkatan,
              ps.id_kejuruan, k.nama_kejuruan,
              ps.id_kelas, kl.nama_kelas
       FROM pertanyaan p
       LEFT JOIN pertanyaan_scope ps ON ps.id_pertanyaan = p.id
       LEFT JOIN sekolah s ON s.id = ps.id_sekolah
       LEFT JOIN angkatan a ON a.id = ps.id_angkatan
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
      id_angkatan: number | null;
      tahun_angkatan: number | null;
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
      isi_pertanyaan?: string; bobot_persentase?: number; kategori?: string
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
