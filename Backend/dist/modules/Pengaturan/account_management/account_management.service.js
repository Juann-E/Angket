"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManagementService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const promise_1 = require("mysql2/promise");
let AccountManagementService = class AccountManagementService {
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
        void this.initDefaultAdmin();
    }
    async initDefaultAdmin() {
        try {
            const [rows] = await this.pool.query('SELECT COUNT(*) AS count FROM admin');
            const row = rows[0];
            const count = row?.count ?? 0;
            if (count === 0) {
                const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME ?? '123';
                const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? '123';
                const defaultRole = 'super_admin';
                await this.createAdmin(defaultUsername, defaultPassword, defaultRole);
                console.log(`Default admin created with username="${defaultUsername}" (role=${defaultRole})`);
            }
        }
        catch (err) {
            console.error('Gagal inisialisasi admin default:', err);
        }
    }
    async createAdmin(username, password, role) {
        const hashed = await bcrypt.hash(password, 10);
        try {
            const [res] = await this.pool.execute('INSERT INTO admin (username, password, role) VALUES (?, ?, ?)', [username, hashed, role]);
            const insertId = res.insertId;
            return { id: insertId, username, role };
        }
        catch (err) {
            const dbErr = err;
            if (dbErr.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException('Username sudah digunakan');
            }
            throw err;
        }
    }
    async findAllAdmins() {
        const [rows] = await this.pool.query('SELECT id, username, role FROM admin ORDER BY id DESC');
        return rows.map((r) => {
            const row = r;
            return {
                id: row.id,
                username: row.username,
                role: row.role,
            };
        });
    }
    async findOneAdmin(id) {
        const [rows] = await this.pool.query('SELECT id, username, role FROM admin WHERE id = ? LIMIT 1', [id]);
        const row = rows[0];
        if (!row) {
            return null;
        }
        return {
            id: row.id,
            username: row.username,
            role: row.role,
        };
    }
    async updateAdmin(id, dto) {
        const fields = [];
        const params = [];
        if (dto.username !== undefined) {
            fields.push('username = ?');
            params.push(dto.username);
        }
        if (dto.password !== undefined) {
            const hashed = await bcrypt.hash(dto.password, 10);
            fields.push('password = ?');
            params.push(hashed);
        }
        if (dto.role !== undefined) {
            fields.push('role = ?');
            params.push(dto.role);
        }
        if (fields.length === 0) {
            return this.findOneAdmin(id);
        }
        params.push(id);
        try {
            await this.pool.execute(`UPDATE admin SET ${fields.join(', ')} WHERE id = ?`, params);
        }
        catch (err) {
            const dbErr = err;
            if (dbErr.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException('Username sudah digunakan');
            }
            throw err;
        }
        return this.findOneAdmin(id);
    }
    async removeAdmin(id) {
        const [res] = await this.pool.execute('DELETE FROM admin WHERE id = ?', [
            id,
        ]);
        const info = res;
        return { deleted: info.affectedRows === 1 };
    }
    async changeOwnPassword(id, oldPassword, newPassword) {
        const [rows] = await this.pool.query('SELECT password FROM admin WHERE id = ? LIMIT 1', [id]);
        const row = rows[0];
        if (!row) {
            throw new common_1.BadRequestException('Admin tidak ditemukan');
        }
        const ok = await bcrypt.compare(oldPassword, row.password);
        if (!ok) {
            throw new common_1.BadRequestException('Password lama tidak sesuai');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.pool.execute('UPDATE admin SET password = ? WHERE id = ?', [
            hashed,
            id,
        ]);
        return { success: true };
    }
};
exports.AccountManagementService = AccountManagementService;
exports.AccountManagementService = AccountManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AccountManagementService);
//# sourceMappingURL=account_management.service.js.map