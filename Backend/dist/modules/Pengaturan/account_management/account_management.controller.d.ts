import { AccountManagementService } from './account_management.service';
import { CreateAdminDto, UpdateAdminDto, ChangePasswordDto } from './dto/account_management.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AccountManagementController {
    private readonly service;
    private readonly jwtService;
    private readonly configService;
    constructor(service: AccountManagementService, jwtService: JwtService, configService: ConfigService);
    createAdmin(dto: CreateAdminDto): Promise<{
        id: number;
        username: string;
        role: import("../../../auth/auth.service").Role;
    }>;
    findAllAdmins(): Promise<{
        id: number;
        username: string;
        role: import("../../../auth/auth.service").Role;
    }[]>;
    findOneAdmin(id: string): Promise<{
        id: number;
        username: string;
        role: import("../../../auth/auth.service").Role;
    }>;
    updateAdmin(id: string, dto: UpdateAdminDto): Promise<{
        id: number;
        username: string;
        role: import("../../../auth/auth.service").Role;
    }>;
    removeAdmin(id: string, req: {
        user?: {
            id?: number;
            role?: string;
        };
    }): Promise<{
        deleted: boolean;
    }>;
    changePassword(dto: ChangePasswordDto, req: {
        user?: {
            id?: number;
        };
        headers?: {
            authorization?: string | string[];
        };
    }): Promise<{
        success: boolean;
    }>;
}
