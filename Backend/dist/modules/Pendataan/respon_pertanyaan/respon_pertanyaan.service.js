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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponPertanyaanService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
const code_management_service_1 = require("../../Pengaturan/code_management/code_management.service");
let ResponPertanyaanService = class ResponPertanyaanService {
    constructor(codeManagementService) {
        this.codeManagementService = codeManagementService;
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
    async submitResponses(code, items) {
        if (!code || !Array.isArray(items) || items.length === 0) {
            throw new common_1.BadRequestException('code dan daftar jawaban wajib diisi');
        }
        const validation = await this.codeManagementService.validateAndConsume(code);
        const id_pelajar = validation.id_pelajar;
        for (const it of items) {
            if (it == null ||
                typeof it.id_pertanyaan !== 'number' ||
                typeof it.skor_poin !== 'number') {
                throw new common_1.BadRequestException('Format jawaban tidak valid');
            }
            if (it.skor_poin < 1 || it.skor_poin > 5) {
                throw new common_1.BadRequestException('Skor di luar rentang 1-5');
            }
            await this.pool.execute('INSERT INTO respon (id_pelajar, id_pertanyaan, skor_poin) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE skor_poin = VALUES(skor_poin)', [id_pelajar, it.id_pertanyaan, it.skor_poin]);
        }
        const result = await this.computeAndSaveSurvey(id_pelajar);
        await this.codeManagementService.finish(code);
        return result;
    }
    async findOneResult(id_pelajar) {
        const [rows] = await this.pool.query(`SELECT h.id AS id_hasil,
              h.id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              s.nama_sekolah,
              kl.nama_kelas,
              h.total_skor,
              h.level_sdness,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       WHERE h.id_pelajar = ?
       LIMIT 1`, [id_pelajar]);
        const row = rows[0];
        if (!row) {
            throw new common_1.BadRequestException('Hasil tidak ditemukan');
        }
        return {
            id_hasil: row.id_hasil,
            id_pelajar: row.id_pelajar,
            nama_pelajar: row.nama_pelajar,
            nomor_absen: row.nomor_absen,
            nama_sekolah: row.nama_sekolah,
            nama_kelas: row.nama_kelas,
            total_skor: row.total_skor,
            level_sdness: row.level_sdness,
            diselesaikan_pada: row.diselesaikan_pada,
        };
    }
    async findAllResults(filter) {
        const conditions = [];
        const params = [];
        if (filter.id_sekolah) {
            conditions.push('s.id = ?');
            params.push(filter.id_sekolah);
        }
        if (filter.id_kelas) {
            conditions.push('kl.id = ?');
            params.push(filter.id_kelas);
        }
        if (filter.nama) {
            conditions.push('p.nama_pelajar LIKE ?');
            params.push(`%${filter.nama}%`);
        }
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';
        const [rows] = await this.pool.query(`SELECT h.id AS id_hasil,
              h.id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              s.nama_sekolah,
              kl.nama_kelas,
              h.total_skor,
              h.level_sdness,
              h.diselesaikan_pada
       FROM hasil_survey h
       JOIN pelajar p ON h.id_pelajar = p.id
       JOIN kelas kl ON p.id_kelas = kl.id
       JOIN kejuruan k ON kl.id_kejuruan = k.id
       JOIN sekolah s ON k.id_sekolah = s.id
       ${whereClause}
       ORDER BY h.diselesaikan_pada DESC`, params);
        return rows.map((r) => {
            const row = r;
            return {
                id_hasil: row.id_hasil,
                id_pelajar: row.id_pelajar,
                nama_pelajar: row.nama_pelajar,
                nomor_absen: row.nomor_absen,
                nama_sekolah: row.nama_sekolah,
                nama_kelas: row.nama_kelas,
                total_skor: row.total_skor,
                level_sdness: row.level_sdness,
                diselesaikan_pada: row.diselesaikan_pada,
            };
        });
    }
    async computeAndSaveSurvey(id_pelajar) {
        const [rows] = await this.pool.query('SELECT SUM(skor_poin) AS total, COUNT(*) AS cnt FROM respon WHERE id_pelajar = ?', [id_pelajar]);
        const agg = rows[0];
        if (!agg || agg.total == null || agg.cnt === 0) {
            throw new common_1.BadRequestException('Belum ada jawaban untuk dihitung');
        }
        if (agg.cnt !== 60) {
            throw new common_1.BadRequestException('Jawaban belum lengkap, 60 pertanyaan harus terisi');
        }
        const total_skor = agg.total;
        let level_sdness;
        if (total_skor >= 60 && total_skor <= 140) {
            level_sdness = 'Low';
        }
        else if (total_skor >= 141 && total_skor <= 220) {
            level_sdness = 'Moderate';
        }
        else {
            level_sdness = 'High';
        }
        await this.pool.execute('INSERT INTO hasil_survey (id_pelajar, total_skor, level_sdness) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE total_skor = VALUES(total_skor), level_sdness = VALUES(level_sdness), diselesaikan_pada = CURRENT_TIMESTAMP', [id_pelajar, total_skor, level_sdness]);
        return { id_pelajar, total_skor, level_sdness };
    }
};
exports.ResponPertanyaanService = ResponPertanyaanService;
exports.ResponPertanyaanService = ResponPertanyaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [code_management_service_1.CodeManagementService])
], ResponPertanyaanService);
//# sourceMappingURL=respon_pertanyaan.service.js.map