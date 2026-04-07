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
exports.SekolahController = void 0;
const common_1 = require("@nestjs/common");
const sekolah_service_1 = require("./sekolah.service");
const create_sekolah_dto_1 = require("./dto/create-sekolah.dto");
const update_sekolah_dto_1 = require("./dto/update-sekolah.dto");
const roles_decorator_1 = require("../../../../auth/roles.decorator");
const jwt_auth_guard_1 = require("../../../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../../../auth/roles.guard");
let SekolahController = class SekolahController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return this.service.create(dto.nama_sekolah);
    }
    async findAll() {
        return this.service.findAll();
    }
    async findOne(id) {
        const item = await this.service.findOne(Number(id));
        if (!item)
            throw new common_1.NotFoundException('Sekolah tidak ditemukan');
        return item;
    }
    async update(id, dto) {
        return this.service.update(Number(id), dto);
    }
    async remove(id) {
        return this.service.remove(Number(id));
    }
};
exports.SekolahController = SekolahController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sekolah_dto_1.CreateSekolahDto]),
    __metadata("design:returntype", Promise)
], SekolahController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SekolahController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SekolahController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sekolah_dto_1.UpdateSekolahDto]),
    __metadata("design:returntype", Promise)
], SekolahController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SekolahController.prototype, "remove", null);
exports.SekolahController = SekolahController = __decorate([
    (0, common_1.Controller)('sekolah'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sekolah_service_1.SekolahService])
], SekolahController);
//# sourceMappingURL=sekolah.controller.js.map