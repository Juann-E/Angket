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
exports.KelasService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let KelasService = class KelasService {
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
    async create(id_kejuruan, nama_kelas) {
        const [res] = await this.pool.execute('INSERT INTO kelas (id_kejuruan, nama_kelas) VALUES (?, ?)', [id_kejuruan, nama_kelas]);
        const insertId = res.insertId;
        return { id: insertId, nama_kelas };
    }
    async findAll(filter) {
        const where = filter?.id_kejuruan ? 'WHERE k.id_kejuruan = ?' : '';
        const params = filter?.id_kejuruan ? [filter.id_kejuruan] : [];
        const [rows] = await this.pool.query(`SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
       LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       ${where}
       ORDER BY k.id DESC`, params);
        return rows;
    }
    async findOne(id) {
        const [rows] = await this.pool.query(`SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
        LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       WHERE k.id = ? LIMIT 1`, [id]);
        const list = rows;
        return list[0] ?? null;
    }
    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.id_kejuruan !== undefined) {
            fields.push('id_kejuruan = ?');
            params.push(payload.id_kejuruan);
        }
        if (payload.nama_kelas !== undefined) {
            fields.push('nama_kelas = ?');
            params.push(payload.nama_kelas);
        }
        if (!fields.length)
            return { affectedRows: 0 };
        params.push(id);
        await this.pool.execute(`UPDATE kelas SET ${fields.join(', ')} WHERE id = ?`, params);
        const [rows] = await this.pool.query(`SELECT k.id, k.id_kejuruan, k.nama_kelas, j.nama_kejuruan
       FROM kelas k
       LEFT JOIN kejuruan j ON j.id = k.id_kejuruan
       WHERE k.id = ?`, [id]);
        const updated = rows[0];
        return updated ?? { affectedRows: 0 };
    }
    async remove(id) {
        const [rows] = await this.pool.query('SELECT id, nama_kelas FROM kelas WHERE id = ?', [id]);
        const current = rows[0];
        if (!current) {
            return { affectedRows: 0 };
        }
        const [res] = await this.pool.execute('DELETE FROM kelas WHERE id = ?', [
            id,
        ]);
        return {
            id: current.id,
            nama_kelas: current.nama_kelas,
            affectedRows: res.affectedRows,
        };
    }
};
exports.KelasService = KelasService;
exports.KelasService = KelasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KelasService);
//# sourceMappingURL=kelas.service.js.map