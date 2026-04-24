type ExportFilter = {
    id_sekolah?: number;
    id_kejuruan?: number;
    id_kelas?: number;
    from?: Date;
    to?: Date;
};
type ExportRow = {
    nama_sekolah: string;
    nama_kejuruan: string;
    nama_kelas: string;
    nama_pelajar: string;
    nomor_absen: string;
    total_skor: number;
    level_sdness: string;
    diselesaikan_pada: Date | null;
};
export declare class ExportHasilService {
    private pool;
    constructor();
    private fetchList;
    getRawData(filter: ExportFilter): Promise<ExportRow[]>;
    generateExcel(filter: ExportFilter): Promise<Buffer>;
}
export {};
