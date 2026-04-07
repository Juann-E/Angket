export declare class SekolahService {
    private pool;
    constructor();
    create(nama_sekolah: string): Promise<{
        id: number;
        nama_sekolah: string;
    }>;
    findAll(): Promise<{
        id: number;
        nama_sekolah: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        nama_sekolah: string;
    }>;
    update(id: number, payload: {
        nama_sekolah?: string;
    }): Promise<any>;
    remove(id: number): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_sekolah?: undefined;
    } | {
        id: any;
        nama_sekolah: any;
        affectedRows: number;
    }>;
}
