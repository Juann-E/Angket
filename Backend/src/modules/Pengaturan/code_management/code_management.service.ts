import { Injectable, BadRequestException } from '@nestjs/common';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class CodeManagementService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    void this.ensureTable();
  }

  private async ensureTable() {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS pin_code (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(8) UNIQUE,
        id_pelajar INT UNIQUE,
        used TINYINT(1) DEFAULT 0,
        used_at TIMESTAMP NULL,
        FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE
      )
    `);
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefhjkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async generateForPelajar(id_pelajar: number) {
    // ensure pelajar exists
    const [pel] = await this.pool.query<RowDataPacket[]>(
      'SELECT id FROM pelajar WHERE id = ? LIMIT 1',
      [id_pelajar],
    );
    if (!pel[0]) throw new BadRequestException('Pelajar tidak ditemukan');

    // if already has code, return it (if not used)
    const [existing] = await this.pool.query<RowDataPacket[]>(
      'SELECT code, used FROM pin_code WHERE id_pelajar = ? LIMIT 1',
      [id_pelajar],
    );
    if (existing[0]) {
      const ex = existing[0] as RowDataPacket & { code: string; used: number };
      return { code: ex.code, used: ex.used === 1 };
    }

    // generate unique code
    let code = this.generateCode();
    // loop until unique

    while (true) {
      const [chk] = await this.pool.query<RowDataPacket[]>(
        'SELECT id FROM pin_code WHERE code = ? LIMIT 1',
        [code],
      );
      if (!chk[0]) break;
      code = this.generateCode();
    }
    await this.pool.execute(
      'INSERT INTO pin_code (code, id_pelajar) VALUES (?, ?)',
      [code, id_pelajar],
    );
    return { code, used: false };
  }

  async validateAndConsume(code: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, id_pelajar, used FROM pin_code WHERE code = ? LIMIT 1',
      [code],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          id: number;
          id_pelajar: number;
          used: number;
        })
      | undefined;
    if (!row) throw new BadRequestException('Kode tidak valid');
    if (row.used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'proses',
      row.id_pelajar,
    ]);
    return { id_pelajar: row.id_pelajar, code, used: false };
  }

  async canRespond(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT used FROM pin_code WHERE id_pelajar = ? LIMIT 1',
      [id_pelajar],
    );
    const row = rows[0] as (RowDataPacket & { used: number }) | undefined;
    if (!row) return false;
    return row.used === 0;
  }

  async submitSingleResponse(
    code: string,
    id_pertanyaan: number,
    skor_poin: number,
  ) {
    const [pins] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, id_pelajar, used FROM pin_code WHERE code = ? LIMIT 1',
      [code],
    );
    const pin = pins[0] as
      | (RowDataPacket & { id: number; id_pelajar: number; used: number })
      | undefined;
    if (!pin) throw new BadRequestException('Kode tidak valid');
    if (pin.used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    // insert one response
    await this.pool.execute(
      'INSERT INTO respon (id_pelajar, id_pertanyaan, skor_poin) VALUES (?, ?, ?)',
      [pin.id_pelajar, id_pertanyaan, skor_poin],
    );
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'proses',
      pin.id_pelajar,
    ]);
    return {
      id_pelajar: pin.id_pelajar,
      id_pertanyaan,
      skor_poin,
      code_used: false,
    };
  }

  async findOneByPelajar(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT pc.code, pc.used, pc.used_at,
              p.id AS id_pelajar, p.nama_pelajar, p.nomor_absen,
              kl.nama_kelas, j.nama_kejuruan, s.nama_sekolah
       FROM pin_code pc
       LEFT JOIN pelajar p ON p.id = pc.id_pelajar
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       WHERE pc.id_pelajar = ?
       LIMIT 1`,
      [id_pelajar],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          code: string;
          used: number;
          used_at: Date | null;
          id_pelajar: number;
          nama_pelajar: string;
          nomor_absen: string;
          nama_kelas: string | null;
          nama_kejuruan: string | null;
          nama_sekolah: string | null;
        })
      | undefined;
    if (!row) {
      throw new BadRequestException('Pelajar belum memiliki kode');
    }
    return {
      code: row.code,
      used: row.used === 1,
      used_at: row.used_at,
      id_pelajar: row.id_pelajar,
      nama_pelajar: row.nama_pelajar,
      nomor_absen: row.nomor_absen,
      nama_kelas: row.nama_kelas,
      nama_kejuruan: row.nama_kejuruan,
      nama_sekolah: row.nama_sekolah,
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
      `SELECT pc.code,
              pc.used,
              pc.used_at,
              p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              kl.id AS id_kelas,
              kl.nama_kelas,
              j.id AS id_kejuruan,
              j.nama_kejuruan,
              s.id AS id_sekolah,
              s.nama_sekolah
       FROM pin_code pc
       LEFT JOIN pelajar p ON p.id = pc.id_pelajar
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       ${where}
       ORDER BY s.nama_sekolah, j.nama_kejuruan, kl.nama_kelas, p.nama_pelajar`,
      params,
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & {
        code: string;
        used: number;
        used_at: Date | null;
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        id_kelas: number | null;
        nama_kelas: string | null;
        id_kejuruan: number | null;
        nama_kejuruan: string | null;
        id_sekolah: number | null;
        nama_sekolah: string | null;
      };
      return {
        code: row.code,
        used: row.used === 1,
        used_at: row.used_at,
        id_pelajar: row.id_pelajar,
        nama_pelajar: row.nama_pelajar,
        nomor_absen: row.nomor_absen,
        id_kelas: row.id_kelas,
        nama_kelas: row.nama_kelas,
        id_kejuruan: row.id_kejuruan,
        nama_kejuruan: row.nama_kejuruan,
        id_sekolah: row.id_sekolah,
        nama_sekolah: row.nama_sekolah,
      };
    });
  }

  async finish(code: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, id_pelajar, used FROM pin_code WHERE code = ? LIMIT 1',
      [code],
    );
    const row = rows[0] as
      | (RowDataPacket & { id: number; id_pelajar: number; used: number })
      | undefined;
    if (!row) throw new BadRequestException('Kode tidak valid');
    if (row.used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    await this.pool.execute(
      'UPDATE pin_code SET used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [row.id],
    );
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'selesai',
      row.id_pelajar,
    ]);
    return { id_pelajar: row.id_pelajar, code, finished: true };
  }
}
