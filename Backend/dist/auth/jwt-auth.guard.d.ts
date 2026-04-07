import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly configService;
    private readonly authService;
    constructor(jwtService: JwtService, configService: ConfigService, authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
