import { PelajarRegisService } from './pelajar_regis.service';
declare class RegisterPelajarDto {
    id_kelas: number;
    nama_pelajar: string;
    nomor_absen: string;
}
declare class UpdatePelajarDto {
    id_kelas?: number;
    nama_pelajar?: string;
    nomor_absen?: string;
}
declare class FindAllFilterDto {
    nama?: string;
    id_sekolah?: string;
    id_kelas?: string;
}
declare class FindOneFilterDto {
    id_pelajar: string;
    id_sekolah?: string;
    id_kejuruan?: string;
    id_kelas?: string;
}
export declare class PelajarRegisController {
    private readonly service;
    constructor(service: PelajarRegisService);
    sekolah(): Promise<{
        id: number;
        nama_sekolah: string;
    }[]>;
    kejuruan(id_sekolah: string): Promise<{
        id: number;
        nama_kejuruan: string;
    }[]>;
    kelas(id_kejuruan: string): Promise<{
        id: number;
        nama_kelas: string;
    }[]>;
    register(dto: RegisterPelajarDto): Promise<{
        id: number;
        id_kelas: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        access_code: string;
    }>;
    findOne(query: FindOneFilterDto): Promise<{
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        id_kelas: number | null;
        nama_kelas: string | null;
        id_kejuruan: number | null;
        nama_kejuruan: string | null;
        id_sekolah: number | null;
        nama_sekolah: string | null;
        access_code: string | null;
        is_used: boolean;
        used_at: Date | null;
        kode_akses: {
            code: string;
            is_used: boolean;
            used_at: Date | null;
        } | null;
    }>;
    findAll(query: FindAllFilterDto): Promise<{
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        id_kelas: number | null;
        nama_kelas: string | null;
        id_kejuruan: number | null;
        nama_kejuruan: string | null;
        id_sekolah: number | null;
        nama_sekolah: string | null;
        access_code: string | null;
        is_used: boolean;
        used_at: Date | null;
        kode_akses: {
            code: string;
            is_used: boolean;
            used_at: Date | null;
        } | null;
    }[]>;
    update(id: string, dto: UpdatePelajarDto): Promise<{
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        id_kelas: number | null;
        nama_kelas: string | null;
        id_kejuruan: number | null;
        nama_kejuruan: string | null;
        id_sekolah: number | null;
        nama_sekolah: string | null;
        access_code: string | null;
        is_used: boolean;
        used_at: Date | null;
        kode_akses: {
            code: string;
            is_used: boolean;
            used_at: Date | null;
        } | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
export {};
