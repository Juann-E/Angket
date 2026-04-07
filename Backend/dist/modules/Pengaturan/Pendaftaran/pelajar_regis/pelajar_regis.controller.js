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
exports.PelajarRegisController = void 0;
const common_1 = require("@nestjs/common");
const pelajar_regis_service_1 = require("./pelajar_regis.service");
const jwt_auth_guard_1 = require("../../../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../../../auth/roles.guard");
const roles_decorator_1 = require("../../../../auth/roles.decorator");
class RegisterPelajarDto {
    id_kelas;
    nama_pelajar;
    nomor_absen;
}
class UpdatePelajarDto {
    id_kelas;
    nama_pelajar;
    nomor_absen;
}
class FindAllFilterDto {
    nama;
    id_sekolah;
    id_kelas;
}
class FindOneFilterDto {
    id_pelajar;
    id_sekolah;
    id_kejuruan;
    id_kelas;
}
let PelajarRegisController = class PelajarRegisController {
    service;
    constructor(service) {
        this.service = service;
    }
    async sekolah() {
        return this.service.listSekolah();
    }
    async kejuruan(id_sekolah) {
        return this.service.listKejuruan(Number(id_sekolah));
    }
    async kelas(id_kejuruan) {
        return this.service.listKelas(Number(id_kejuruan));
    }
    async register(dto) {
        return this.service.registerPelajar(dto.id_kelas, dto.nama_pelajar, dto.nomor_absen);
    }
    async findOne(query) {
        return this.service.findOne({
            id_pelajar: Number(query.id_pelajar),
            id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
            id_kejuruan: query.id_kejuruan ? Number(query.id_kejuruan) : undefined,
            id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
        });
    }
    async findAll(query) {
        return this.service.findAll({
            nama: query.nama || undefined,
            id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
            id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
        });
    }
    async update(id, dto) {
        return this.service.update(Number(id), dto);
    }
    async remove(id) {
        return this.service.remove(Number(id));
    }
};
exports.PelajarRegisController = PelajarRegisController;
__decorate([
    (0, common_1.Get)('sekolah'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "sekolah", null);
__decorate([
    (0, common_1.Get)('kejuruan'),
    __param(0, (0, common_1.Query)('id_sekolah')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "kejuruan", null);
__decorate([
    (0, common_1.Get)('kelas'),
    __param(0, (0, common_1.Query)('id_kejuruan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "kelas", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterPelajarDto]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('find_one'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindOneFilterDto]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('find_all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindAllFilterDto]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePelajarDto]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PelajarRegisController.prototype, "remove", null);
exports.PelajarRegisController = PelajarRegisController = __decorate([
    (0, common_1.Controller)('pengaturan/pelajar_regis'),
    __metadata("design:paramtypes", [pelajar_regis_service_1.PelajarRegisService])
], PelajarRegisController);
//# sourceMappingURL=pelajar_regis.controller.js.map