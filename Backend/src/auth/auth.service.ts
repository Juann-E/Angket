import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

type Role = 'super_admin' | 'admin';

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
    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
