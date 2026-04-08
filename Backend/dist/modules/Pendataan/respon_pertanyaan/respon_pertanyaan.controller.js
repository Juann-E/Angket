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
exports.ResponPertanyaanController = void 0;
const common_1 = require("@nestjs/common");
const respon_pertanyaan_service_1 = require("./respon_pertanyaan.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/roles.guard");
const roles_decorator_1 = require("../../../auth/roles.decorator");
const respon_pertanyaan_dto_1 = require("./dto/respon_pertanyaan.dto");
let ResponPertanyaanController = class ResponPertanyaanController {
    constructor(service, jwtService, configService) {
        this.service = service;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async submit(dto, req) {
        const authHeader = req.headers.authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET') ?? 'changeme',
            });
            if (payload.role === 'admin' || payload.role === 'super_admin') {
                throw new common_1.ForbiddenException('Admin tidak boleh mengisi jawaban');
            }
        }
        return this.service.submitResponses(dto.code, dto.items);
    }
    async resultOne(id_pelajar) {
        return this.service.findOneResult(Number(id_pelajar));
    }
    async results(query) {
        return this.service.findAllResults({
            id_sekolah: query.id_sekolah ? Number(query.id_sekolah) : undefined,
            id_kelas: query.id_kelas ? Number(query.id_kelas) : undefined,
            nama: query.nama || undefined,
        });
    }
};
exports.ResponPertanyaanController = ResponPertanyaanController;
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [respon_pertanyaan_dto_1.SubmitResponDto, Object]),
    __metadata("design:returntype", Promise)
], ResponPertanyaanController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('result_one'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)('id_pelajar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResponPertanyaanController.prototype, "resultOne", null);
__decorate([
    (0, common_1.Get)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [respon_pertanyaan_dto_1.FindResultsFilterDto]),
    __metadata("design:returntype", Promise)
], ResponPertanyaanController.prototype, "results", null);
exports.ResponPertanyaanController = ResponPertanyaanController = __decorate([
    (0, common_1.Controller)('pendataan/respon_pertanyaan'),
    __metadata("design:paramtypes", [respon_pertanyaan_service_1.ResponPertanyaanService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ResponPertanyaanController);
//# sourceMappingURL=respon_pertanyaan.controller.js.map