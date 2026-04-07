import { ExportHasilService } from './export_hasil.service';
import type { Response } from 'express';
export declare class ExportHasilController {
    private readonly service;
    constructor(service: ExportHasilService);
    exportExcel(id_sekolah?: string, id_kejuruan?: string, id_kelas?: string, from?: string, to?: string, res?: Response): Promise<Buffer<ArrayBufferLike> | undefined>;
    getExportData(id_sekolah?: string, id_kejuruan?: string, id_kelas?: string, from?: string, to?: string): Promise<{
        nama_sekolah: string;
        nama_kejuruan: string;
        nama_kelas: string;
        nama_pelajar: string;
        nomor_absen: string;
        total_skor: number;
        level_sdness: string;
        diselesaikan_pada: Date | null;
    }[]>;
}
