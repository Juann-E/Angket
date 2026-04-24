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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportHasilService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
const exceljs_1 = __importDefault(require("exceljs"));
let ExportHasilService = class ExportHasilService {
    constructor() {
        const isProduction = process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com');
        this.pool = (0, promise_1.createPool)({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),
            ...(isProduction && {
                ssl: {
                    rejectUnauthorized: false,
                },
            }),
            connectTimeout: 20000,
        });
    }
    async fetchList(filter) {
        const conditions = [];
        const params = [];
        if (filter.id_sekolah) {
            conditions.push('s.id = ?');
            params.push(filter.id_sekolah);
        }
        if (filter.id_kejuruan) {
            conditions.push('k.id = ?');
            params.push(filter.id_kejuruan);
        }
        if (filter.id_kelas) {
            conditions.push('kl.id = ?');
            params.push(filter.id_kelas);
        }
        if (filter.from) {
            conditions.push('h.diselesaikan_pada >= ?');
            params.push(filter.from);
        }
        if (filter.to) {
            conditions.push('h.diselesaikan_pada <= ?');
            params.push(filter.to);
        }
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';
        const [rows] = await this.pool.query(`SELECT s.nama_sekolah,
              k.nama_kejuruan,
              kl.nama_kelas,
              p.nama_pelajar,
              p.nomor_absen,
              h.total_skor,
              h.level_sdness,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       ${whereClause}
       ORDER BY s.nama_sekolah,
                k.nama_kejuruan,
                kl.nama_kelas,
                p.nama_pelajar`, params);
        const list = rows.map((r) => {
            const row = r;
            return {
                nama_sekolah: row.nama_sekolah,
                nama_kejuruan: row.nama_kejuruan,
                nama_kelas: row.nama_kelas,
                nama_pelajar: row.nama_pelajar,
                nomor_absen: row.nomor_absen,
                total_skor: row.total_skor,
                level_sdness: row.level_sdness,
                diselesaikan_pada: row.diselesaikan_pada,
            };
        });
        return list;
    }
    async getRawData(filter) {
        return this.fetchList(filter);
    }
    async generateExcel(filter) {
        const list = await this.fetchList(filter);
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet('Hasil Survey');
        const satuSekolah = filter.id_sekolah && list.length > 0 ? list[0].nama_sekolah : 'Semua';
        const satuKejuruan = filter.id_kejuruan && list.length > 0 ? list[0].nama_kejuruan : 'Semua';
        const satuKelas = filter.id_kelas && list.length > 0 ? list[0].nama_kelas : 'Semua';
        sheet.addRow(['nama_sekolah']);
        sheet.addRow([satuSekolah]);
        sheet.addRow([]);
        sheet.addRow(['nama_kejuruan']);
        sheet.addRow([satuKejuruan]);
        sheet.addRow([]);
        sheet.addRow(['Nama_kelas']);
        sheet.addRow([satuKelas]);
        sheet.addRow([]);
        const avg = list.length > 0
            ? list.reduce((sum, it) => sum + it.total_skor, 0) / list.length
            : 0;
        sheet.addRow(['Rata_rata_total']);
        sheet.addRow([avg]);
        sheet.addRow([]);
        sheet.addRow([
            'Nama_Peserta',
            'nomor_absen',
            'Waktu_selesai',
            'Total_skor',
        ]);
        for (const item of list) {
            sheet.addRow([
                item.nama_pelajar,
                item.nomor_absen,
                item.diselesaikan_pada
                    ? item.diselesaikan_pada.toISOString().replace('T', ' ').slice(0, 16)
                    : '',
                item.total_skor,
            ]);
        }
        const buf = (await workbook.xlsx.writeBuffer());
        return buf;
    }
};
exports.ExportHasilService = ExportHasilService;
exports.ExportHasilService = ExportHasilService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExportHasilService);
//# sourceMappingURL=export_hasil.service.js.map