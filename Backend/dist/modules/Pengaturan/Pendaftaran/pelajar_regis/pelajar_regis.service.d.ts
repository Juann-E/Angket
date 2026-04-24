import { CodeManagementService } from '../../code_management/code_management.service';
export declare class PelajarRegisService {
    private readonly codeManagementService;
    private pool;
    constructor(codeManagementService: CodeManagementService);
    listSekolah(): Promise<{
        id: number;
        nama_sekolah: string;
    }[]>;
    listKejuruan(id_sekolah: number): Promise<{
        id: number;
        nama_kejuruan: string;
    }[]>;
    listKelas(id_kejuruan: number): Promise<{
        id: number;
        nama_kelas: string;
    }[]>;
    registerPelajar(id_kelas: number, nama_pelajar: string, nomor_absen: string): Promise<{
        id: number;
        id_kelas: number;
        nama_pelajar: string;
        nomor_absen: string;
        status_isi: string;
        access_code: string;
    }>;
    findOne(filter: {
        id_pelajar: number;
        id_sekolah?: number;
        id_kejuruan?: number;
        id_kelas?: number;
    }): Promise<{
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
    findAll(filter: {
        nama?: string;
        id_sekolah?: number;
        id_kelas?: number;
    }): Promise<{
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
    update(id_pelajar: number, data: {
        id_kelas?: number;
        nama_pelajar?: string;
        nomor_absen?: string;
    }): Promise<{
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
    remove(id_pelajar: number): Promise<{
        success: boolean;
    }>;
}
