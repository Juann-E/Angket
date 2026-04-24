import { JwtService } from '@nestjs/jwt';
export type Role = 'super_admin' | 'admin';
export declare class AuthService {
    private readonly jwtService;
    private pool;
    private readonly revokedJtis;
    constructor(jwtService: JwtService);
    validateUser(username: string, password: string): Promise<{
        id: number;
        username: string;
        role: Role;
    } | null>;
    login(username: string, password: string): Promise<{
        access_token: string;
    }>;
    revokeToken(jti: string): void;
    isTokenRevoked(jti: string): boolean;
}
