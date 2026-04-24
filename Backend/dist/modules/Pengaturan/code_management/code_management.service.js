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
exports.CodeManagementService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let CodeManagementService = class CodeManagementService {
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
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefhjkmnpqrstuvwxyz';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }
    async generateForPelajar(id_pelajar) {
        const [pelRows] = await this.pool.query('SELECT id, id_kelas, id_access_code FROM pelajar WHERE id = ? LIMIT 1', [id_pelajar]);
        const pel = pelRows[0];
        if (!pel)
            throw new common_1.BadRequestException('Pelajar tidak ditemukan');
        if (pel.id_access_code != null) {
            const [accRows] = await this.pool.query('SELECT code, is_used FROM access_code WHERE id = ? LIMIT 1', [pel.id_access_code]);
            const acc = accRows[0];
            if (!acc) {
                throw new common_1.BadRequestException('Access code tidak ditemukan');
            }
            return { code: acc.code, used: acc.is_used === 1 };
        }
        let code = this.generateCode();
        while (true) {
            const [chk] = await this.pool.query('SELECT id FROM access_code WHERE code = ? LIMIT 1', [code]);
            if (!chk[0])
                break;
            code = this.generateCode();
        }
        const [insertRes] = await this.pool.execute('INSERT INTO access_code (code, id_kelas) VALUES (?, ?)', [code, pel.id_kelas]);
        const accessId = insertRes.insertId;
        await this.pool.execute('UPDATE pelajar SET id_access_code = ? WHERE id = ?', [accessId, id_pelajar]);
        return { code, used: false };
    }
    async validateAndConsume(code) {
        const [rows] = await this.pool.query(`SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`, [code]);
        const row = rows[0];
        if (!row)
            throw new common_1.BadRequestException('Kode tidak valid');
        if (row.is_used === 1) {
            const [hasilRows] = await this.pool.query(`SELECT total_skor, level_sdness
         FROM hasil_survey
         WHERE id_pelajar = ?
         LIMIT 1`, [row.id_pelajar]);
            const hasil = hasilRows[0];
            if (hasil) {
                return {
                    id_pelajar: row.id_pelajar,
                    code,
                    used: true,
                    hasilSurvei: {
                        total_skor: hasil.total_skor,
                        level_sdness: hasil.level_sdness
                    }
                };
            }
            else {
                throw new common_1.BadRequestException('Kode sudah selesai digunakan, tetapi hasil survei belum tersedia');
            }
        }
        await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
            'proses',
            row.id_pelajar,
        ]);
        return { id_pelajar: row.id_pelajar, code, used: false };
    }
    async canRespond(id_pelajar) {
        const [rows] = await this.pool.query(`SELECT ac.is_used
       FROM pelajar p
       JOIN access_code ac ON ac.id = p.id_access_code
       WHERE p.id = ?
       LIMIT 1`, [id_pelajar]);
        const row = rows[0];
        if (!row)
            return false;
        return row.is_used === 0;
    }
    async submitSingleResponse(code, id_pertanyaan, skor_poin) {
        const [pins] = await this.pool.query(`SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`, [code]);
        const pin = pins[0];
        if (!pin)
            throw new common_1.BadRequestException('Kode tidak valid');
        if (pin.is_used === 1)
            throw new common_1.BadRequestException('Kode sudah selesai digunakan');
        await this.pool.execute('INSERT INTO respon (id_pelajar, id_pertanyaan, skor_poin) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE skor_poin = VALUES(skor_poin)', [pin.id_pelajar, id_pertanyaan, skor_poin]);
        await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
            'proses',
            pin.id_pelajar,
        ]);
        return {
            id_pelajar: pin.id_pelajar,
            id_pertanyaan,
            skor_poin,
            code_used: false,
        };
    }
    async finishByPelajar(id_pelajar) {
        const [rows] = await this.pool.query(`SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM pelajar p
       JOIN access_code ac ON ac.id = p.id_access_code
       WHERE p.id = ?
       LIMIT 1`, [id_pelajar]);
        const row = rows[0];
        if (!row)
            throw new common_1.BadRequestException('Kode tidak valid');
        if (row.is_used === 1)
            throw new common_1.BadRequestException('Kode sudah selesai digunakan');
        await this.pool.execute('UPDATE access_code SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);
        await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
            'selesai',
            row.id_pelajar,
        ]);
        return { id_pelajar: row.id_pelajar, finished: true };
    }
    async finish(code) {
        const [rows] = await this.pool.query(`SELECT ac.id,
              ac.is_used,
              p.id AS id_pelajar
       FROM access_code ac
       JOIN pelajar p ON p.id_access_code = ac.id
       WHERE ac.code = ?
       LIMIT 1`, [code]);
        const row = rows[0];
        if (!row)
            throw new common_1.BadRequestException('Kode tidak valid');
        if (row.is_used === 1)
            throw new common_1.BadRequestException('Kode sudah selesai digunakan');
        const [aggRows] = await this.pool.query('SELECT SUM(skor_poin) AS total, COUNT(*) AS cnt FROM respon WHERE id_pelajar = ?', [row.id_pelajar]);
        const agg = aggRows[0];
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
        await this.pool.execute('INSERT INTO hasil_survey (id_pelajar, total_skor, level_sdness) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE total_skor = VALUES(total_skor), level_sdness = VALUES(level_sdness), diselesaikan_pada = CURRENT_TIMESTAMP', [row.id_pelajar, total_skor, level_sdness]);
        await this.pool.execute('UPDATE access_code SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);
        await this.pool.execute('UPDATE pelajar SET status_isi = ? WHERE id = ?', [
            'selesai',
            row.id_pelajar,
        ]);
        return { id_pelajar: row.id_pelajar, code, finished: true, total_skor, level_sdness };
    }
    async findAllCodes() {
        const [rows] = await this.pool.query(`SELECT ac.id,
              ac.code,
              ac.is_used,
              ac.id_kelas,
              ac.created_at,
              ac.used_at,
              p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              p.status_isi,
              k.nama_kelas
       FROM access_code ac
       LEFT JOIN pelajar p ON p.id_access_code = ac.id
       LEFT JOIN kelas k ON k.id = ac.id_kelas
       ORDER BY ac.created_at DESC`);
        return rows;
    }
};
exports.CodeManagementService = CodeManagementService;
exports.CodeManagementService = CodeManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CodeManagementService);
//# sourceMappingURL=code_management.service.js.map