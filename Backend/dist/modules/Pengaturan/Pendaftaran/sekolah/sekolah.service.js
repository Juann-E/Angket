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
exports.SekolahService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let SekolahService = class SekolahService {
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
    async create(nama_sekolah) {
        const [res] = await this.pool.execute('INSERT INTO sekolah (nama_sekolah) VALUES (?)', [nama_sekolah]);
        const insertId = res.insertId;
        return { id: insertId, nama_sekolah: nama_sekolah };
    }
    async findAll() {
        const [rows] = await this.pool.query('SELECT id, nama_sekolah FROM sekolah ORDER BY id DESC');
        return rows;
    }
    async findOne(id) {
        const [rows] = await this.pool.query('SELECT id, nama_sekolah FROM sekolah WHERE id = ? LIMIT 1', [id]);
        const list = rows;
        return list[0] ?? null;
    }
    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.nama_sekolah !== undefined) {
            fields.push('nama_sekolah = ?');
            params.push(payload.nama_sekolah);
        }
        if (!fields.length)
            return { affectedRows: 0 };
        params.push(id);
        await this.pool.execute(`UPDATE sekolah SET ${fields.join(', ')} WHERE id = ?`, params);
        const [rows] = await this.pool.execute('SELECT id, nama_sekolah FROM sekolah WHERE id = ?', [id]);
        return rows[0];
    }
    async remove(id) {
        const [rows] = await this.pool.execute('SELECT id, nama_sekolah FROM sekolah WHERE id = ?', [id]);
        const data = rows[0];
        if (!data) {
            return { affectedRows: 0 };
        }
        const [res] = await this.pool.execute('DELETE FROM sekolah WHERE id = ?', [
            id,
        ]);
        return {
            id: data.id,
            nama_sekolah: data.nama_sekolah,
            affectedRows: res.affectedRows,
        };
    }
};
exports.SekolahService = SekolahService;
exports.SekolahService = SekolahService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SekolahService);
//# sourceMappingURL=sekolah.service.js.map