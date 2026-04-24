export declare class PertanyaanService {
    private pool;
    constructor();
    create(isi_pertanyaan: string, bobot_persentase: number, kategori: string): Promise<{
        id: number;
    }>;
    findAll(): Promise<{
        id: number;
        isi_pertanyaan: string;
        kategori: string;
        tipe_soal: string;
        bobot_persentase: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        isi_pertanyaan: string;
        kategori: string;
        tipe_soal: string;
        bobot_persentase: number;
    }>;
    update(id: number, payload: {
        isi_pertanyaan?: string;
        bobot_persentase?: number;
        kategori?: string;
    }): Promise<{
        success: boolean;
    }>;
    remove(id: number): Promise<{
        affectedRows: number;
    }>;
}
