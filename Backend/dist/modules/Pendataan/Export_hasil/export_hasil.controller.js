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
exports.ExportHasilController = void 0;
const common_1 = require("@nestjs/common");
const export_hasil_service_1 = require("./export_hasil.service");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/roles.guard");
const roles_decorator_1 = require("../../../auth/roles.decorator");
let ExportHasilController = class ExportHasilController {
    service;
    constructor(service) {
        this.service = service;
    }
    async exportExcel(id_sekolah, id_kejuruan, id_kelas, from, to, res) {
        const filter = {
            id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
            id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
            id_kelas: id_kelas ? Number(id_kelas) : undefined,
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
        };
        const buffer = await this.service.generateExcel(filter);
        if (res) {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="hasil_survey.xlsx"');
            res.send(buffer);
            return;
        }
        return buffer;
    }
    async getExportData(id_sekolah, id_kejuruan, id_kelas, from, to) {
        const filter = {
            id_sekolah: id_sekolah ? Number(id_sekolah) : undefined,
            id_kejuruan: id_kejuruan ? Number(id_kejuruan) : undefined,
            id_kelas: id_kelas ? Number(id_kelas) : undefined,
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
        };
        return this.service.getRawData(filter);
    }
};
exports.ExportHasilController = ExportHasilController;
__decorate([
    (0, common_1.Get)('excel'),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)('id_sekolah')),
    __param(1, (0, common_1.Query)('id_kejuruan')),
    __param(2, (0, common_1.Query)('id_kelas')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportHasilController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)('data'),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)('id_sekolah')),
    __param(1, (0, common_1.Query)('id_kejuruan')),
    __param(2, (0, common_1.Query)('id_kelas')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ExportHasilController.prototype, "getExportData", null);
exports.ExportHasilController = ExportHasilController = __decorate([
    (0, common_1.Controller)('pendataan/export_hasil'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [export_hasil_service_1.ExportHasilService])
], ExportHasilController);
//# sourceMappingURL=export_hasil.controller.js.map