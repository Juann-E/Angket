"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PertanyaanModule = void 0;
const common_1 = require("@nestjs/common");
const pertanyaan_service_1 = require("./pertanyaan.service");
const pertanyaan_controller_1 = require("./pertanyaan.controller");
const auth_module_1 = require("../../../auth/auth.module");
let PertanyaanModule = class PertanyaanModule {
};
exports.PertanyaanModule = PertanyaanModule;
exports.PertanyaanModule = PertanyaanModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [pertanyaan_service_1.PertanyaanService],
        controllers: [pertanyaan_controller_1.PertanyaanController],
        exports: [pertanyaan_service_1.PertanyaanService],
    })
], PertanyaanModule);
//# sourceMappingURL=pertanyaan.module.js.map