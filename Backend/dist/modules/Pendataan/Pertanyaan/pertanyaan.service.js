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
exports.PertanyaanService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let PertanyaanService = class PertanyaanService {
    pool;
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
    async create(isi_pertanyaan, bobot_persentase, kategori) {
        const [countRows] = await this.pool.query('SELECT COUNT(*) AS cnt FROM pertanyaan');
        const cnt = countRows[0]?.cnt ?? 0;
        if (cnt >= 60) {
            throw new common_1.BadRequestException('Kuota 60 pertanyaan global sudah terpenuhi');
        }
        const [categoryRows] = await this.pool.query('SELECT COUNT(*) AS cnt FROM pertanyaan WHERE kategori = ?', [kategori]);
        const categoryCnt = categoryRows[0]?.cnt ?? 0;
        if (categoryCnt >= 12) {
            throw new common_1.BadRequestException('Kuota 12 pertanyaan untuk kategori ini sudah terpenuhi');
        }
        const [res] = await this.pool.execute('INSERT INTO pertanyaan (isi_pertanyaan, kategori, tipe_soal, bobot_persentase) VALUES (?, ?, ?, ?)', [isi_pertanyaan, kategori, 'pilihan_ganda', bobot_persentase]);
        const insertId = res.insertId;
        return { id: insertId };
    }
    async findAll() {
        const [rows] = await this.pool.query(`SELECT id,
              isi_pertanyaan,
              kategori,
              tipe_soal,
              bobot_persentase
       FROM pertanyaan
       ORDER BY id DESC`);
        return rows;
    }
    async findOne(id) {
        const [rows] = await this.pool.query(`SELECT id,
              isi_pertanyaan,
              kategori,
              tipe_soal,
              bobot_persentase
       FROM pertanyaan
       WHERE id = ?
       LIMIT 1`, [id]);
        const list = rows;
        return list[0] ?? null;
    }
    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.isi_pertanyaan !== undefined) {
            fields.push('isi_pertanyaan = ?');
            params.push(payload.isi_pertanyaan);
        }
        if (payload.bobot_persentase !== undefined) {
            fields.push('bobot_persentase = ?');
            params.push(payload.bobot_persentase);
        }
        if (payload.kategori !== undefined) {
            fields.push('kategori = ?');
            params.push(payload.kategori);
        }
        if (fields.length) {
            params.push(id);
            await this.pool.execute(`UPDATE pertanyaan SET ${fields.join(', ')} WHERE id = ?`, params);
        }
        return { success: true };
    }
    async remove(id) {
        const [res] = await this.pool.execute('DELETE FROM pertanyaan WHERE id = ?', [id]);
        return {
            affectedRows: res.affectedRows,
        };
    }
};
exports.PertanyaanService = PertanyaanService;
exports.PertanyaanService = PertanyaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PertanyaanService);
//# sourceMappingURL=pertanyaan.service.js.map