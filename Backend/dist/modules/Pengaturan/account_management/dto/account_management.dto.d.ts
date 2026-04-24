import type { Role } from '../../../../auth/auth.service';
export declare class CreateAdminDto {
    username: string;
    password: string;
    role: Role;
}
export declare class UpdateAdminDto {
    username?: string;
    password?: string;
    role?: Role;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
