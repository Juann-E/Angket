import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import { CodeManagementService } from '../../code_management/code_management.service';

@Injectable()
export class PelajarRegisService {
  private pool: Pool;

  constructor(private readonly codeManagementService: CodeManagementService) {
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
      const codeInfo: { code: string; used: boolean } =
        await this.codeManagementService.generateForPelajar(insertId);
      return {
        id: insertId,
        id_kelas,
        nama_pelajar,
        nomor_absen,
        status_isi: 'belum',
        access_code: codeInfo.code,
      };
    } catch (err) {
      const dbErr = err as { code?: string };
      if (dbErr.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Siswa sudah terdaftar di kelas yang dipilih',
        );
      }
      throw err;
    }
  }

  async findOne(filter: {
    id_pelajar: number;
    id_sekolah?: number;
    id_kejuruan?: number;
    id_kelas?: number;
  }) {
    const conditions: string[] = ['p.id = ?'];
    const params: any[] = [filter.id_pelajar];
    if (filter.id_kelas !== undefined) {
      conditions.push('kl.id = ?');
      params.push(filter.id_kelas);
    }
    if (filter.id_kejuruan !== undefined) {
      conditions.push('j.id = ?');
      params.push(filter.id_kejuruan);
    }
    if (filter.id_sekolah !== undefined) {
      conditions.push('s.id = ?');
      params.push(filter.id_sekolah);
    }
    const where = `WHERE ${conditions.join(' AND ')}`;

    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              p.status_isi,
              kl.id AS id_kelas,
              kl.nama_kelas,
              j.id AS id_kejuruan,
              j.nama_kejuruan,
              s.id AS id_sekolah,
              s.nama_sekolah,
              ac.code,
              ac.is_used,
              ac.used_at
       FROM pelajar p
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       LEFT JOIN access_code ac ON ac.id = p.id_access_code
       ${where}
       LIMIT 1`,
      params,
    );
    const row = rows[0] as
      | (RowDataPacket & {
          id_pelajar: number;
          nama_pelajar: string;
          nomor_absen: string;
          status_isi: string;
          id_kelas: number | null;
          nama_kelas: string | null;
          id_kejuruan: number | null;
          nama_kejuruan: string | null;
          id_sekolah: number | null;
          nama_sekolah: string | null;
          code: string | null;
          is_used: number | null;
          used_at: Date | null;
        })
      | undefined;
    if (!row) {
      throw new BadRequestException('Pelajar tidak ditemukan');
    }
    return {
      id_pelajar: row.id_pelajar,
      nama_pelajar: row.nama_pelajar,
      nomor_absen: row.nomor_absen,
      status_isi: row.status_isi,
      id_kelas: row.id_kelas,
      nama_kelas: row.nama_kelas,
      id_kejuruan: row.id_kejuruan,
      nama_kejuruan: row.nama_kejuruan,
      id_sekolah: row.id_sekolah,
      nama_sekolah: row.nama_sekolah,
      access_code: row.code,
      is_used: row.is_used === 1,
      used_at: row.used_at,
      kode_akses: row.code
        ? {
            code: row.code,
            is_used: row.is_used === 1,
            used_at: row.used_at,
          }
        : null,
    };
  }

  async findAll(filter: {
    nama?: string;
    id_sekolah?: number;
    id_kelas?: number;
  }) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (filter.id_sekolah !== undefined) {
      conditions.push('s.id = ?');
      params.push(filter.id_sekolah);
    }
    if (filter.id_kelas !== undefined) {
      conditions.push('kl.id = ?');
      params.push(filter.id_kelas);
    }
    if (filter.nama) {
      const like = `%${filter.nama}%`;
      conditions.push(
        '(p.nama_pelajar LIKE ? OR s.nama_sekolah LIKE ? OR j.nama_kejuruan LIKE ?)',
      );
      params.push(like, like, like);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              p.status_isi,
              kl.id AS id_kelas,
              kl.nama_kelas,
              j.id AS id_kejuruan,
              j.nama_kejuruan,
              s.id AS id_sekolah,
              s.nama_sekolah,
              ac.code,
              ac.is_used,
              ac.used_at
       FROM pelajar p
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       LEFT JOIN access_code ac ON ac.id = p.id_access_code
       ${where}
       ORDER BY s.nama_sekolah, j.nama_kejuruan, kl.nama_kelas, p.nama_pelajar`,
      params,
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & {
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        id_kelas: number | null;
        nama_kelas: string | null;
        id_kejuruan: number | null;
        nama_kejuruan: string | null;
        id_sekolah: number | null;
        nama_sekolah: string | null;
        code: string | null;
        is_used: number | null;
        used_at: Date | null;
      };
      return {
        id_pelajar: row.id_pelajar,
        nama_pelajar: row.nama_pelajar,
        nomor_absen: row.nomor_absen,
        status_isi: row.status_isi,
        id_kelas: row.id_kelas,
        nama_kelas: row.nama_kelas,
        id_kejuruan: row.id_kejuruan,
        nama_kejuruan: row.nama_kejuruan,
        id_sekolah: row.id_sekolah,
        nama_sekolah: row.nama_sekolah,
        access_code: row.code,
        is_used: row.is_used === 1,
        used_at: row.used_at,
        kode_akses: row.code
          ? {
              code: row.code,
              is_used: row.is_used === 1,
              used_at: row.used_at,
            }
          : null,
      };
    });
  }

  async update(
    id_pelajar: number,
    data: {
      id_kelas?: number;
      nama_pelajar?: string;
      nomor_absen?: string;
    },
  ) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT id_kelas, nama_pelajar, nomor_absen 
       FROM pelajar 
       WHERE id = ? 
       LIMIT 1`,
      [id_pelajar],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          id_kelas: number | null;
          nama_pelajar: string;
          nomor_absen: string;
        })
      | undefined;
    if (!row) {
      throw new BadRequestException('Pelajar tidak ditemukan');
    }

    const id_kelas = data.id_kelas !== undefined ? data.id_kelas : row.id_kelas;
    const nama_pelajar =
      data.nama_pelajar !== undefined ? data.nama_pelajar : row.nama_pelajar;
    const nomor_absen =
      data.nomor_absen !== undefined ? data.nomor_absen : row.nomor_absen;

    try {
      await this.pool.execute(
        'UPDATE pelajar SET id_kelas = ?, nama_pelajar = ?, nomor_absen = ? WHERE id = ?',
        [id_kelas, nama_pelajar, nomor_absen, id_pelajar],
      );
    } catch (err) {
      const dbErr = err as { code?: string };
      if (dbErr.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Siswa sudah terdaftar di kelas yang dipilih',
        );
      }
      throw err;
    }

    return this.findOne({ id_pelajar });
  }

  async remove(id_pelajar: number) {
    const [res] = await this.pool.execute('DELETE FROM pelajar WHERE id = ?', [
      id_pelajar,
    ]);
    const result = res as unknown as { affectedRows?: number };
    if (!result.affectedRows) {
      throw new BadRequestException('Pelajar tidak ditemukan');
    }
    return { success: true };
  }
}
