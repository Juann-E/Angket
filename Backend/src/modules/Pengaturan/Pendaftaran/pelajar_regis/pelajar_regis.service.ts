import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class PelajarRegisService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async listSekolah() {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, nama_sekolah FROM sekolah ORDER BY id DESC',
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & { id: number; nama_sekolah: string };
      return { id: row.id, nama_sekolah: row.nama_sekolah };
    });
  }

  async listKejuruan(id_sekolah: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT k.id, k.nama_kejuruan 
       FROM kejuruan k 
       WHERE k.id_sekolah = ? 
       ORDER BY k.id DESC`,
      [id_sekolah],
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & { id: number; nama_kejuruan: string };
      return { id: row.id, nama_kejuruan: row.nama_kejuruan };
    });
  }

  async listKelas(id_kejuruan: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT kl.id, kl.nama_kelas 
       FROM kelas kl 
       WHERE kl.id_kejuruan = ? 
       ORDER BY kl.id DESC`,
      [id_kejuruan],
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & { id: number; nama_kelas: string };
      return { id: row.id, nama_kelas: row.nama_kelas };
    });
  }

  async registerPelajar(
    id_kelas: number,
    nama_pelajar: string,
    nomor_absen: string,
  ) {
    try {
      const [res] = await this.pool.execute(
        'INSERT INTO pelajar (id_kelas, nama_pelajar, nomor_absen, status_isi) VALUES (?, ?, ?, ?)',
        [id_kelas, nama_pelajar, nomor_absen, 'belum'],
      );
      const insertId = (res as unknown as { insertId: number }).insertId;
      return {
        id: insertId,
        id_kelas,
        nama_pelajar,
        nomor_absen,
        status_isi: 'belum',
      };
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Siswa sudah terdaftar di kelas yang dipilih',
        );
      }
      throw err;
    }
  }
}
