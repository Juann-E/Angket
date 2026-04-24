"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SekolahModule = void 0;
const common_1 = require("@nestjs/common");
const sekolah_service_1 = require("./sekolah.service");
const sekolah_controller_1 = require("./sekolah.controller");
const auth_module_1 = require("../../../../auth/auth.module");
let SekolahModule = class SekolahModule {
};
exports.SekolahModule = SekolahModule;
exports.SekolahModule = SekolahModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [sekolah_service_1.SekolahService],
        controllers: [sekolah_controller_1.SekolahController],
        exports: [sekolah_service_1.SekolahService],
    })
], SekolahModule);
//# sourceMappingURL=sekolah.module.js.map