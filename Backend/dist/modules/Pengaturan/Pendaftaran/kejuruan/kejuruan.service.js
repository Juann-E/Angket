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
exports.KejuruanService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
let KejuruanService = class KejuruanService {
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
    async create(id_sekolah, nama_kejuruan) {
        const [res] = await this.pool.execute('INSERT INTO kejuruan (id_sekolah, nama_kejuruan) VALUES (?, ?)', [id_sekolah, nama_kejuruan]);
        const insertId = res.insertId;
        return { id: insertId, kejuruan: nama_kejuruan };
    }
    async findAll(filter) {
        const where = filter?.id_sekolah ? 'WHERE k.id_sekolah = ?' : '';
        const params = filter?.id_sekolah ? [filter.id_sekolah] : [];
        const [rows] = await this.pool.query(`SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       ${where}
       ORDER BY k.id DESC`, params);
        return rows;
    }
    async findOne(id) {
        const [rows] = await this.pool.query(`SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       WHERE k.id = ?
       LIMIT 1`, [id]);
        const list = rows;
        return list[0] ?? null;
    }
    async update(id, payload) {
        const fields = [];
        const params = [];
        if (payload.id_sekolah !== undefined) {
            fields.push('id_sekolah = ?');
            params.push(payload.id_sekolah);
        }
        if (payload.nama_kejuruan !== undefined) {
            fields.push('nama_kejuruan = ?');
            params.push(payload.nama_kejuruan);
        }
        if (!fields.length)
            return { affectedRows: 0 };
        params.push(id);
        await this.pool.execute(`UPDATE kejuruan SET ${fields.join(', ')} WHERE id = ?`, params);
        const [rows] = await this.pool.query(`SELECT k.id, k.id_sekolah, k.nama_kejuruan, s.nama_sekolah
       FROM kejuruan k
       LEFT JOIN sekolah s ON s.id = k.id_sekolah
       WHERE k.id = ?`, [id]);
        const updated = rows[0];
        return updated ?? { affectedRows: 0 };
    }
    async remove(id) {
        const [rows] = await this.pool.query('SELECT id, nama_kejuruan FROM kejuruan WHERE id = ?', [id]);
        const current = rows[0];
        if (!current) {
            return { affectedRows: 0 };
        }
        const [res] = await this.pool.execute('DELETE FROM kejuruan WHERE id = ?', [
            id,
        ]);
        return {
            id: current.id,
            nama_kejuruan: current.nama_kejuruan,
            affectedRows: res.affectedRows,
        };
    }
};
exports.KejuruanService = KejuruanService;
exports.KejuruanService = KejuruanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KejuruanService);
//# sourceMappingURL=kejuruan.service.js.map