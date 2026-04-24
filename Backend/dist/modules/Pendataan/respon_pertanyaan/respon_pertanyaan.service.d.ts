import { CodeManagementService } from '../../Pengaturan/code_management/code_management.service';
type ResponseItem = {
    id_pertanyaan: number;
    skor_poin: number;
};
export declare class ResponPertanyaanService {
    private readonly codeManagementService;
    private pool;
    constructor(codeManagementService: CodeManagementService);
    submitResponses(code: string, items: ResponseItem[]): Promise<{
        id_pelajar: number;
        total_skor: number;
        level_sdness: "Low" | "Moderate" | "High";
    }>;
    findOneResult(id_pelajar: number): Promise<{
        id_hasil: number;
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        nama_sekolah: string;
        nama_kelas: string;
        total_skor: number;
        level_sdness: string;
        diselesaikan_pada: Date | null;
    }>;
    findAllResults(filter: {
        id_sekolah?: number;
        id_kelas?: number;
        nama?: string;
    }): Promise<{
        id_hasil: number;
        id_pelajar: number;
        nama_pelajar: string;
        nomor_absen: string;
        nama_sekolah: string;
        nama_kelas: string;
        total_skor: number;
        level_sdness: string;
        diselesaikan_pada: Date | null;
    }[]>;
    computeAndSaveSurvey(id_pelajar: number): Promise<{
        id_pelajar: number;
        total_skor: number;
        level_sdness: "Low" | "Moderate" | "High";
    }>;
}
export {};
