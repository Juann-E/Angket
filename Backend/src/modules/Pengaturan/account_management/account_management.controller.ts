import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountManagementService } from './account_management.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  ChangePasswordDto,
} from './dto/account_management.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

@Controller('pengaturan/account_management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountManagementController {
  constructor(
    private readonly service: AccountManagementService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('admin')
  @Roles('super_admin')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.service.createAdmin(dto.username, dto.password, dto.role);
  }

  @Get('admin')
  @Roles('super_admin')
  async findAllAdmins() {
    return this.service.findAllAdmins();
  }

  @Get('admin/:id')
  @Roles('super_admin')
  async findOneAdmin(@Param('id') id: string) {
    const admin = await this.service.findOneAdmin(Number(id));
    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }
    return admin;
  }

  @Patch('admin/:id')
  @Roles('super_admin')
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    const admin = await this.service.updateAdmin(Number(id), dto);
    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }
    return admin;
  }

  @Delete('admin/:id')
  @Roles('super_admin')
  async removeAdmin(
    @Param('id') id: string,
    @Req()
    req: {
      user?: { id?: number; role?: string };
    },
  ) {
    const targetId = Number(id);
    const currentId = req.user?.id;
    if (currentId != null && Number(currentId) === targetId) {
      throw new BadRequestException(
        'Akun yang sedang login tidak dapat dihapus',
      );
    }
    const result = await this.service.removeAdmin(targetId);
    if (!result.deleted) {
      throw new NotFoundException('Admin tidak ditemukan');
    }
    return result;
  }

  @Post('change_password')
  @Roles('super_admin', 'admin')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req()
    req: {
      user?: { id?: number };
      headers?: { authorization?: string | string[] };
    },
  ) {
    if (
      !dto ||
      typeof dto.oldPassword !== 'string' ||
      typeof dto.newPassword !== 'string'
    ) {
      throw new BadRequestException('Body ganti password tidak valid');
    }
    let numericId = req.user?.id;
    if (numericId == null) {
      const authHeader = req.headers?.authorization;
      if (typeof authHeader !== 'string') {
        throw new UnauthorizedException();
      }
      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET') ?? 'changeme',
        },
      );
      numericId = payload.sub;
    }
    numericId = typeof numericId === 'number' ? numericId : Number(numericId);
    if (!Number.isFinite(numericId)) {
      throw new BadRequestException('ID user pada token tidak valid');
    }
    return this.service.changeOwnPassword(
      numericId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
