"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponPertanyaanModule = void 0;
const common_1 = require("@nestjs/common");
const respon_pertanyaan_service_1 = require("./respon_pertanyaan.service");
const respon_pertanyaan_controller_1 = require("./respon_pertanyaan.controller");
const auth_module_1 = require("../../../auth/auth.module");
const code_management_module_1 = require("../../Pengaturan/code_management/code_management.module");
let ResponPertanyaanModule = class ResponPertanyaanModule {
};
exports.ResponPertanyaanModule = ResponPertanyaanModule;
exports.ResponPertanyaanModule = ResponPertanyaanModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, code_management_module_1.CodeManagementModule],
        controllers: [respon_pertanyaan_controller_1.ResponPertanyaanController],
        providers: [respon_pertanyaan_service_1.ResponPertanyaanService],
        exports: [respon_pertanyaan_service_1.ResponPertanyaanService],
    })
], ResponPertanyaanModule);
//# sourceMappingURL=respon_pertanyaan.module.js.map