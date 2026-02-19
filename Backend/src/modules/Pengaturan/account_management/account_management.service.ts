import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import type { Role } from '../../../auth/auth.service';
import { UpdateAdminDto } from './dto/account_management.dto';

@Injectable()
export class AccountManagementService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async createAdmin(username: string, password: string, role: Role) {
    const hashed = await bcrypt.hash(password, 10);
    try {
      const [res] = await this.pool.execute(
        'INSERT INTO admin (username, password, role) VALUES (?, ?, ?)',
        [username, hashed, role],
      );
      const insertId = (res as unknown as { insertId: number }).insertId;
      return { id: insertId, username, role };
    } catch (err) {
      const dbErr = err as { code?: string };
      if (dbErr.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Username sudah digunakan');
      }
      throw err;
    }
  }

  async findAllAdmins() {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, username, role FROM admin ORDER BY id DESC',
    );
    return rows.map((r) => {
      const row = r as RowDataPacket & {
        id: number;
        username: string;
        role: Role;
      };
      return {
        id: row.id,
        username: row.username,
        role: row.role,
      };
    });
  }

  async findOneAdmin(id: number) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, username, role FROM admin WHERE id = ? LIMIT 1',
      [id],
    );
    const row = rows[0] as
      | (RowDataPacket & { id: number; username: string; role: Role })
      | undefined;
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      username: row.username,
      role: row.role,
    };
  }

  async updateAdmin(id: number, dto: UpdateAdminDto) {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (dto.username !== undefined) {
      fields.push('username = ?');
      params.push(dto.username);
    }
    if (dto.password !== undefined) {
      const hashed = await bcrypt.hash(dto.password, 10);
      fields.push('password = ?');
      params.push(hashed);
    }
    if (dto.role !== undefined) {
      fields.push('role = ?');
      params.push(dto.role);
    }

    if (fields.length === 0) {
      return this.findOneAdmin(id);
    }

    params.push(id);
    try {
      await this.pool.execute(
        `UPDATE admin SET ${fields.join(', ')} WHERE id = ?`,
        params,
      );
    } catch (err) {
      const dbErr = err as { code?: string };
      if (dbErr.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Username sudah digunakan');
      }
      throw err;
    }

    return this.findOneAdmin(id);
  }

  async removeAdmin(id: number) {
    const [res] = await this.pool.execute('DELETE FROM admin WHERE id = ?', [
      id,
    ]);
    const info = res as unknown as { affectedRows?: number };
    return { deleted: info.affectedRows === 1 };
  }

  async changeOwnPassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT password FROM admin WHERE id = ? LIMIT 1',
      [id],
    );
    const row = rows[0] as
      | (RowDataPacket & {
          password: string;
        })
      | undefined;
    if (!row) {
      throw new BadRequestException('Admin tidak ditemukan');
    }
    const ok = await bcrypt.compare(oldPassword, row.password);
    if (!ok) {
      throw new BadRequestException('Password lama tidak sesuai');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.pool.execute('UPDATE admin SET password = ? WHERE id = ?', [
      hashed,
      id,
    ]);
    return { success: true };
  }
}
