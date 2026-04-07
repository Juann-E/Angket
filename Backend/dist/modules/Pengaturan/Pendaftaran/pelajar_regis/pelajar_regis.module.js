"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PelajarRegisModule = void 0;
const common_1 = require("@nestjs/common");
const pelajar_regis_service_1 = require("./pelajar_regis.service");
const pelajar_regis_controller_1 = require("./pelajar_regis.controller");
const code_management_module_1 = require("../../code_management/code_management.module");
const auth_module_1 = require("../../../../auth/auth.module");
let PelajarRegisModule = class PelajarRegisModule {
};
exports.PelajarRegisModule = PelajarRegisModule;
exports.PelajarRegisModule = PelajarRegisModule = __decorate([
    (0, common_1.Module)({
        imports: [code_management_module_1.CodeManagementModule, auth_module_1.AuthModule],
        controllers: [pelajar_regis_controller_1.PelajarRegisController],
        providers: [pelajar_regis_service_1.PelajarRegisService],
        exports: [pelajar_regis_service_1.PelajarRegisService],
    })
], PelajarRegisModule);
//# sourceMappingURL=pelajar_regis.module.js.map