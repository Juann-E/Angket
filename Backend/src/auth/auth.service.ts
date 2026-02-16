import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import { randomUUID } from 'crypto';

export type Role = 'super_admin' | 'admin';

@Injectable()
export class AuthService {
  private pool: Pool;

  constructor(private readonly jwtService: JwtService) {
    this.pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    void this.ensureRevokedTable();
  }

  private async ensureRevokedTable() {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS revoked_token (
        id INT PRIMARY KEY AUTO_INCREMENT,
        jti VARCHAR(255) UNIQUE,
        revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async validateUser(username: string, password: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id, username, password, role FROM admin WHERE username = ? LIMIT 1',
      [username],
    );
    const user = rows[0] as unknown as
      | { id: number; username: string; password: string; role: Role }
      | undefined;
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return { id: user.id, username: user.username, role: user.role };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const jti = randomUUID();
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      jti,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async revokeToken(jti: string) {
    await this.pool.execute(
      'INSERT IGNORE INTO revoked_token (jti) VALUES (?)',
      [jti],
    );
  }

  async isTokenRevoked(jti: string) {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT id FROM revoked_token WHERE jti = ? LIMIT 1',
      [jti],
    );
    return !!rows[0];
  }
}
