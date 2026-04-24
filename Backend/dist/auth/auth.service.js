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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const promise_1 = require("mysql2/promise");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.revokedJtis = new Set();
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
    async validateUser(username, password) {
        const [rows] = await this.pool.query('SELECT id, username, password, role FROM admin WHERE username = ? LIMIT 1', [username]);
        const user = rows[0];
        if (!user)
            return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            return null;
        return { id: user.id, username: user.username, role: user.role };
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const jti = (0, crypto_1.randomUUID)();
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
            jti,
        };
        const access_token = await this.jwtService.signAsync(payload);
        return { access_token };
    }
    revokeToken(jti) {
        this.revokedJtis.add(jti);
    }
    isTokenRevoked(jti) {
        return this.revokedJtis.has(jti);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map