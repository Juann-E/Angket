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
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefhjkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async generateForPelajar(
    id_pelajar: number,
  ): Promise<{ code: string; used: boolean }> {
    const [pelRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, id_kelas, id_access_code FROM pelajar WHERE id = ? LIMIT 1',
      [id_pelajar],
    );
    const pel = pelRows[0] as
      | (RowDataPacket & {
          id: number;
          id_kelas: number | null;
          id_access_code: number | null;
        })
      | undefined;
    if (!pel) throw new BadRequestException('Pelajar tidak ditemukan');

    if (pel.id_access_code != null) {
      const [accRows] = await this.pool.query<RowDataPacket[]>(
        'SELECT code, is_used FROM access_code WHERE id = ? LIMIT 1',
        [pel.id_access_code],
      );
      const acc = accRows[0] as
        | (RowDataPacket & { code: string; is_used: number })
        | undefined;
      if (!acc) {
        throw new BadRequestException('Access code tidak ditemukan');
      }
      return { code: acc.code, used: acc.is_used === 1 };
    }

    let code = this.generateCode();
    while (true) {
      const [chk] = await this.pool.query<RowDataPacket[]>(
        'SELECT id FROM access_code WHERE code = ? LIMIT 1',
        [code],
      );
      if (!chk[0]) break;
      code = this.generateCode();
    }
    const [insertRes] = await this.pool.execute(
      'INSERT INTO access_code (code, id_kelas) VALUES (?, ?)',
      [code, pel.id_kelas],
    );
    const accessId = (insertRes as unknown as { insertId: number }).insertId;
    await this.pool.execute(
      'UPDATE pelajar SET id_access_code = ? WHERE id = ?',
      [accessId, id_pelajar],
    );
    return { code, used: false };
  }

  async validateAndConsume(code: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`,
      [code],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          id: number;
          is_used: number;
          id_pelajar: number;
        })
      | undefined;
    if (!row) throw new BadRequestException('Kode tidak valid');
    if (row.is_used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'proses',
      row.id_pelajar,
    ]);
    return { id_pelajar: row.id_pelajar, code, used: false };
  }

  async canRespond(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ac.is_used
       FROM pelajar p
       JOIN access_code ac ON ac.id = p.id_access_code
       WHERE p.id = ?
       LIMIT 1`,
      [id_pelajar],
    );
    const row = rows[0] as (RowDataPacket & { is_used: number }) | undefined;
    if (!row) return false;
    return row.is_used === 0;
  }

  async submitSingleResponse(
    code: string,
    id_pertanyaan: number,
    skor_poin: number,
  ) {
    const [pins] = await this.pool.query<RowDataPacket[]>(
      `SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`,
      [code],
    );
    const pin = pins[0] as
      | (RowDataPacket & { id: number; id_pelajar: number; is_used: number })
      | undefined;
    if (!pin) throw new BadRequestException('Kode tidak valid');
    if (pin.is_used === 1)
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

  async finishByPelajar(id_pelajar: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM pelajar p
       JOIN access_code ac ON ac.id = p.id_access_code
       WHERE p.id = ?
       LIMIT 1`,
      [id_pelajar],
    );
    const row = rows[0] as
      | (RowDataPacket & { id: number; id_pelajar: number; is_used: number })
      | undefined;
    if (!row) throw new BadRequestException('Kode tidak valid');
    if (row.is_used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    await this.pool.execute(
      'UPDATE access_code SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [row.id],
    );
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'selesai',
      row.id_pelajar,
    ]);
    return { id_pelajar: row.id_pelajar, finished: true };
  }

  async finish(code: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`,
      [code],
    );
    const row = rows[0] as
      | (RowDataPacket & { id: number; id_pelajar: number; is_used: number })
      | undefined;
    if (!row) throw new BadRequestException('Kode tidak valid');
    if (row.is_used === 1)
      throw new BadRequestException('Kode sudah selesai digunakan');
    await this.pool.execute(
      'UPDATE access_code SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?',
      [row.id],
    );
    await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
      'selesai',
      row.id_pelajar,
    ]);
    return { id_pelajar: row.id_pelajar, code, finished: true };
  }
}
