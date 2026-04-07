"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const pertanyaan_module_1 = require("./modules/Pendataan/Pertanyaan/pertanyaan.module");
const sekolah_module_1 = require("./modules/Pengaturan/Pendaftaran/sekolah/sekolah.module");
const kejuruan_module_1 = require("./modules/Pengaturan/Pendaftaran/kejuruan/kejuruan.module");
const kelas_module_1 = require("./modules/Pengaturan/Pendaftaran/kelas/kelas.module");
const pelajar_regis_module_1 = require("./modules/Pengaturan/Pendaftaran/pelajar_regis/pelajar_regis.module");
const code_management_module_1 = require("./modules/Pengaturan/code_management/code_management.module");
const account_management_module_1 = require("./modules/Pengaturan/account_management/account_management.module");
const respon_pertanyaan_module_1 = require("./modules/Pendataan/respon_pertanyaan/respon_pertanyaan.module");
const export_hasil_module_1 = require("./modules/Pendataan/Export_hasil/export_hasil.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            pertanyaan_module_1.PertanyaanModule,
            sekolah_module_1.SekolahModule,
            kejuruan_module_1.KejuruanModule,
            kelas_module_1.KelasModule,
            pelajar_regis_module_1.PelajarRegisModule,
            code_management_module_1.CodeManagementModule,
            account_management_module_1.AccountManagementModule,
            respon_pertanyaan_module_1.ResponPertanyaanModule,
            export_hasil_module_1.ExportHasilModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map