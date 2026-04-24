export declare class SubmitResponDto {
    code: string;
    items: Array<{
        id_pertanyaan: number;
        skor_poin: number;
    }>;
}
export declare class FindResultsFilterDto {
    id_sekolah?: string;
    id_kelas?: string;
    nama?: string;
}
