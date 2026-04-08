import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import { randomUUID } from 'crypto';

export type Role = 'super_admin' | 'admin';

@Injectable()
export class AuthService {
  private pool: Pool;
  private readonly revokedJtis = new Set<string>();

  constructor(private readonly jwtService: JwtService) {
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

  revokeToken(jti: string) {
    this.revokedJtis.add(jti);
  }

  isTokenRevoked(jti: string): boolean {
    return this.revokedJtis.has(jti);
  }
}
