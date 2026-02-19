import type { Role } from '../../../../auth/auth.service';

export class CreateAdminDto {
  username!: string;
  password!: string;
  role!: Role;
}

export class UpdateAdminDto {
  username?: string;
  password?: string;
  role?: Role;
}

export class ChangePasswordDto {
  oldPassword!: string;
  newPassword!: string;
}
