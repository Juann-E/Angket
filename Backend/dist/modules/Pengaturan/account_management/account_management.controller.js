"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManagementController = void 0;
const common_1 = require("@nestjs/common");
const account_management_service_1 = require("./account_management.service");
const account_management_dto_1 = require("./dto/account_management.dto");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/roles.guard");
const roles_decorator_1 = require("../../../auth/roles.decorator");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
let AccountManagementController = class AccountManagementController {
    service;
    jwtService;
    configService;
    constructor(service, jwtService, configService) {
        this.service = service;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createAdmin(dto) {
        return this.service.createAdmin(dto.username, dto.password, dto.role);
    }
    async findAllAdmins() {
        return this.service.findAllAdmins();
    }
    async findOneAdmin(id) {
        const admin = await this.service.findOneAdmin(Number(id));
        if (!admin) {
            throw new common_1.NotFoundException('Admin tidak ditemukan');
        }
        return admin;
    }
    async updateAdmin(id, dto) {
        const admin = await this.service.updateAdmin(Number(id), dto);
        if (!admin) {
            throw new common_1.NotFoundException('Admin tidak ditemukan');
        }
        return admin;
    }
    async removeAdmin(id, req) {
        const targetId = Number(id);
        const currentId = req.user?.id;
        if (currentId != null && Number(currentId) === targetId) {
            throw new common_1.BadRequestException('Akun yang sedang login tidak dapat dihapus');
        }
        const result = await this.service.removeAdmin(targetId);
        if (!result.deleted) {
            throw new common_1.NotFoundException('Admin tidak ditemukan');
        }
        return result;
    }
    async changePassword(dto, req) {
        if (!dto ||
            typeof dto.oldPassword !== 'string' ||
            typeof dto.newPassword !== 'string') {
            throw new common_1.BadRequestException('Body ganti password tidak valid');
        }
        let numericId = req.user?.id;
        if (numericId == null) {
            const authHeader = req.headers?.authorization;
            if (typeof authHeader !== 'string') {
                throw new common_2.UnauthorizedException();
            }
            const [type, token] = authHeader.split(' ');
            if (type !== 'Bearer' || !token) {
                throw new common_2.UnauthorizedException();
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET') ?? 'changeme',
            });
            numericId = payload.sub;
        }
        numericId = typeof numericId === 'number' ? numericId : Number(numericId);
        if (!Number.isFinite(numericId)) {
            throw new common_1.BadRequestException('ID user pada token tidak valid');
        }
        return this.service.changeOwnPassword(numericId, dto.oldPassword, dto.newPassword);
    }
};
exports.AccountManagementController = AccountManagementController;
__decorate([
    (0, common_1.Post)('admin'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_management_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "findAllAdmins", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "findOneAdmin", null);
__decorate([
    (0, common_1.Patch)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, account_management_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "removeAdmin", null);
__decorate([
    (0, common_1.Post)('change_password'),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_management_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AccountManagementController.prototype, "changePassword", null);
exports.AccountManagementController = AccountManagementController = __decorate([
    (0, common_1.Controller)('pengaturan/account_management'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [account_management_service_1.AccountManagementService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AccountManagementController);
//# sourceMappingURL=account_management.controller.js.map