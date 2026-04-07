import type { Role } from '../../../auth/auth.service';
import { UpdateAdminDto } from './dto/account_management.dto';
export declare class AccountManagementService {
    private pool;
    constructor();
    private initDefaultAdmin;
    createAdmin(username: string, password: string, role: Role): Promise<{
        id: number;
        username: string;
        role: Role;
    }>;
    findAllAdmins(): Promise<{
        id: number;
        username: string;
        role: Role;
    }[]>;
    findOneAdmin(id: number): Promise<{
        id: number;
        username: string;
        role: Role;
    } | null>;
    updateAdmin(id: number, dto: UpdateAdminDto): Promise<{
        id: number;
        username: string;
        role: Role;
    } | null>;
    removeAdmin(id: number): Promise<{
        deleted: boolean;
    }>;
    changeOwnPassword(id: number, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
