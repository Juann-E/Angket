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
exports.CodeManagementController = void 0;
const common_1 = require("@nestjs/common");
const code_management_service_1 = require("./code_management.service");
const code_management_dto_1 = require("./dto/code_management.dto");
let CodeManagementController = class CodeManagementController {
    service;
    constructor(service) {
        this.service = service;
    }
    async generate(dto) {
        return this.service.generateForPelajar(dto.id_pelajar);
    }
    async validate(dto) {
        return this.service.validateAndConsume(dto.code);
    }
    async canRespond(id_pelajar) {
        return { canRespond: await this.service.canRespond(Number(id_pelajar)) };
    }
    async submitResponse(dto) {
        return this.service.submitSingleResponse(dto.code, dto.id_pertanyaan, dto.skor_poin);
    }
    async finish(dto) {
        return this.service.finish(dto.code);
    }
    async getAllCodes() {
        return this.service.findAllCodes();
    }
};
exports.CodeManagementController = CodeManagementController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_management_dto_1.GenerateDto]),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_management_dto_1.ValidateDto]),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "validate", null);
__decorate([
    (0, common_1.Get)('can_respond'),
    __param(0, (0, common_1.Query)('id_pelajar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "canRespond", null);
__decorate([
    (0, common_1.Post)('submit_response'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_management_dto_1.SubmitResponseDto]),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "submitResponse", null);
__decorate([
    (0, common_1.Post)('finish'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_management_dto_1.FinishDto]),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "finish", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodeManagementController.prototype, "getAllCodes", null);
exports.CodeManagementController = CodeManagementController = __decorate([
    (0, common_1.Controller)('pengaturan/code_management'),
    __metadata("design:paramtypes", [code_management_service_1.CodeManagementService])
], CodeManagementController);
//# sourceMappingURL=code_management.controller.js.map