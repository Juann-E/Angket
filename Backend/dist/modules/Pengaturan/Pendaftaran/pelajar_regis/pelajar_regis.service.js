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
exports.PelajarRegisService = void 0;
const common_1 = require("@nestjs/common");
const promise_1 = require("mysql2/promise");
const code_management_service_1 = require("../../code_management/code_management.service");
let PelajarRegisService = class PelajarRegisService {
    codeManagementService;
    pool;
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
    async listSekolah() {
        const [rows] = await this.pool.query('SELECT id, nama_sekolah FROM sekolah ORDER BY id DESC');
        return rows.map((r) => {
            const row = r;
            return { id: row.id, nama_sekolah: row.nama_sekolah };
        });
    }
    async listKejuruan(id_sekolah) {
        const [rows] = await this.pool.query(`SELECT k.id, k.nama_kejuruan 
       FROM kejuruan k 
       WHERE k.id_sekolah = ? 
       ORDER BY k.id DESC`, [id_sekolah]);
        return rows.map((r) => {
            const row = r;
            return { id: row.id, nama_kejuruan: row.nama_kejuruan };
        });
    }
    async listKelas(id_kejuruan) {
        const [rows] = await this.pool.query(`SELECT kl.id, kl.nama_kelas 
       FROM kelas kl 
       WHERE kl.id_kejuruan = ? 
       ORDER BY kl.id DESC`, [id_kejuruan]);
        return rows.map((r) => {
            const row = r;
            return { id: row.id, nama_kelas: row.nama_kelas };
        });
    }
    async registerPelajar(id_kelas, nama_pelajar, nomor_absen) {
        try {
            const [res] = await this.pool.execute('INSERT INTO pelajar (id_kelas, nama_pelajar, nomor_absen, status_isi) VALUES (?, ?, ?, ?)', [id_kelas, nama_pelajar, nomor_absen, 'belum']);
            const insertId = res.insertId;
            const codeInfo = await this.codeManagementService.generateForPelajar(insertId);
            return {
                id: insertId,
                id_kelas,
                nama_pelajar,
                nomor_absen,
                status_isi: 'belum',
                access_code: codeInfo.code,
            };
        }
        catch (err) {
            const dbErr = err;
            if (dbErr.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException('Siswa sudah terdaftar di kelas yang dipilih');
            }
            throw err;
        }
    }
    async findOne(filter) {
        const conditions = ['p.id = ?'];
        const params = [filter.id_pelajar];
        if (filter.id_kelas !== undefined) {
            conditions.push('kl.id = ?');
            params.push(filter.id_kelas);
        }
        if (filter.id_kejuruan !== undefined) {
            conditions.push('j.id = ?');
            params.push(filter.id_kejuruan);
        }
        if (filter.id_sekolah !== undefined) {
            conditions.push('s.id = ?');
            params.push(filter.id_sekolah);
        }
        const where = `WHERE ${conditions.join(' AND ')}`;
        const [rows] = await this.pool.query(`SELECT p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              p.status_isi,
              kl.id AS id_kelas,
              kl.nama_kelas,
              j.id AS id_kejuruan,
              j.nama_kejuruan,
              s.id AS id_sekolah,
              s.nama_sekolah,
              ac.code,
              ac.is_used,
              ac.used_at
       FROM pelajar p
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       LEFT JOIN access_code ac ON ac.id = p.id_access_code
       ${where}
       LIMIT 1`, params);
        const row = rows[0];
        if (!row) {
            throw new common_1.BadRequestException('Pelajar tidak ditemukan');
        }
        return {
            id_pelajar: row.id_pelajar,
            nama_pelajar: row.nama_pelajar,
            nomor_absen: row.nomor_absen,
            status_isi: row.status_isi,
            id_kelas: row.id_kelas,
            nama_kelas: row.nama_kelas,
            id_kejuruan: row.id_kejuruan,
            nama_kejuruan: row.nama_kejuruan,
            id_sekolah: row.id_sekolah,
            nama_sekolah: row.nama_sekolah,
            access_code: row.code,
            is_used: row.is_used === 1,
            used_at: row.used_at,
            kode_akses: row.code
                ? {
                    code: row.code,
                    is_used: row.is_used === 1,
                    used_at: row.used_at,
                }
                : null,
        };
    }
    async findAll(filter) {
        const conditions = [];
        const params = [];
        if (filter.id_sekolah !== undefined) {
            conditions.push('s.id = ?');
            params.push(filter.id_sekolah);
        }
        if (filter.id_kelas !== undefined) {
            conditions.push('kl.id = ?');
            params.push(filter.id_kelas);
        }
        if (filter.nama) {
            const like = `%${filter.nama}%`;
            conditions.push('(p.nama_pelajar LIKE ? OR s.nama_sekolah LIKE ? OR j.nama_kejuruan LIKE ?)');
            params.push(like, like, like);
        }
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await this.pool.query(`SELECT p.id AS id_pelajar,
              p.nama_pelajar,
              p.nomor_absen,
              p.status_isi,
              kl.id AS id_kelas,
              kl.nama_kelas,
              j.id AS id_kejuruan,
              j.nama_kejuruan,
              s.id AS id_sekolah,
              s.nama_sekolah,
              ac.code,
              ac.is_used,
              ac.used_at
       FROM pelajar p
       LEFT JOIN kelas kl ON kl.id = p.id_kelas
       LEFT JOIN kejuruan j ON j.id = kl.id_kejuruan
       LEFT JOIN sekolah s ON s.id = j.id_sekolah
       LEFT JOIN access_code ac ON ac.id = p.id_access_code
       ${where}
       ORDER BY s.nama_sekolah, j.nama_kejuruan, kl.nama_kelas, p.nama_pelajar`, params);
        return rows.map((r) => {
            const row = r;
            return {
                id_pelajar: row.id_pelajar,
                nama_pelajar: row.nama_pelajar,
                nomor_absen: row.nomor_absen,
                status_isi: row.status_isi,
                id_kelas: row.id_kelas,
                nama_kelas: row.nama_kelas,
                id_kejuruan: row.id_kejuruan,
                nama_kejuruan: row.nama_kejuruan,
                id_sekolah: row.id_sekolah,
                nama_sekolah: row.nama_sekolah,
                access_code: row.code,
                is_used: row.is_used === 1,
                used_at: row.used_at,
                kode_akses: row.code
                    ? {
                        code: row.code,
                        is_used: row.is_used === 1,
                        used_at: row.used_at,
                    }
                    : null,
            };
        });
    }
    async update(id_pelajar, data) {
        const [rows] = await this.pool.query(`SELECT id_kelas, nama_pelajar, nomor_absen 
       FROM pelajar 
       WHERE id = ? 
       LIMIT 1`, [id_pelajar]);
        const row = rows[0];
        if (!row) {
            throw new common_1.BadRequestException('Pelajar tidak ditemukan');
        }
        const id_kelas = data.id_kelas !== undefined ? data.id_kelas : row.id_kelas;
        const nama_pelajar = data.nama_pelajar !== undefined ? data.nama_pelajar : row.nama_pelajar;
        const nomor_absen = data.nomor_absen !== undefined ? data.nomor_absen : row.nomor_absen;
        try {
            await this.pool.execute('UPDATE pelajar SET id_kelas = ?, nama_pelajar = ?, nomor_absen = ? WHERE id = ?', [id_kelas, nama_pelajar, nomor_absen, id_pelajar]);
        }
        catch (err) {
            const dbErr = err;
            if (dbErr.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException('Siswa sudah terdaftar di kelas yang dipilih');
            }
            throw err;
        }
        return this.findOne({ id_pelajar });
    }
    async remove(id_pelajar) {
        const [res] = await this.pool.execute('DELETE FROM pelajar WHERE id = ?', [
            id_pelajar,
        ]);
        const result = res;
        if (!result.affectedRows) {
            throw new common_1.BadRequestException('Pelajar tidak ditemukan');
        }
        return { success: true };
    }
};
exports.PelajarRegisService = PelajarRegisService;
exports.PelajarRegisService = PelajarRegisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [code_management_service_1.CodeManagementService])
], PelajarRegisService);
//# sourceMappingURL=pelajar_regis.service.js.map