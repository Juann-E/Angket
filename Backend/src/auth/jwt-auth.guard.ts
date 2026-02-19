import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, Role } from './auth.service';

type JwtPayload = {
  sub: number;
  username: string;
  role: Role;
  jti: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string | string[] };
      user?: { id: number; username: string; role: Role; jti: string };
    }>();
    const authHeader = request.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException();
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET') ?? 'changeme',
      });
    } catch {
      throw new UnauthorizedException();
    }
    if (this.authService.isTokenRevoked(payload.jti)) {
      throw new UnauthorizedException();
    }
    request.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      jti: payload.jti,
    };
    return true;
  }
}
