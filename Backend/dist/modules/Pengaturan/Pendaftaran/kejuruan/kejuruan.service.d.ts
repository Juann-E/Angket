export declare class KejuruanService {
    private pool;
    constructor();
    create(id_sekolah: number, nama_kejuruan: string): Promise<{
        id: number;
        kejuruan: string;
    }>;
    findAll(filter?: {
        id_sekolah?: number;
    }): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    }>;
    update(id: number, payload: {
        id_sekolah?: number;
        nama_kejuruan?: string;
    }): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    } | {
        affectedRows: number;
    }>;
    remove(id: number): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_kejuruan?: undefined;
    } | {
        id: number;
        nama_kejuruan: string;
        affectedRows: number;
    }>;
}
