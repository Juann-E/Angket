import { RowDataPacket } from 'mysql2/promise';
export declare class CodeManagementService {
    private pool;
    constructor();
    private generateCode;
    generateForPelajar(id_pelajar: number): Promise<{
        code: string;
        used: boolean;
    }>;
    validateAndConsume(code: string): Promise<{
        id_pelajar: number;
        code: string;
        used: boolean;
    }>;
    canRespond(id_pelajar: number): Promise<boolean>;
    submitSingleResponse(code: string, id_pertanyaan: number, skor_poin: number): Promise<{
        id_pelajar: number;
        id_pertanyaan: number;
        skor_poin: number;
        code_used: boolean;
    }>;
    finishByPelajar(id_pelajar: number): Promise<{
        id_pelajar: number;
        finished: boolean;
    }>;
    finish(code: string): Promise<{
        id_pelajar: number;
        code: string;
        finished: boolean;
    }>;
    findAllCodes(): Promise<RowDataPacket[]>;
}
