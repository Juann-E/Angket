export declare class KelasService {
    private pool;
    constructor();
    create(id_kejuruan: number, nama_kelas: string): Promise<{
        id: number;
        nama_kelas: string;
    }>;
    findAll(filter?: {
        id_kejuruan?: number;
    }): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    }>;
    update(id: number, payload: {
        id_kejuruan?: number;
        nama_kelas?: string;
    }): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    } | {
        affectedRows: number;
    }>;
    remove(id: number): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_kelas?: undefined;
    } | {
        id: number;
        nama_kelas: string;
        affectedRows: number;
    }>;
}
