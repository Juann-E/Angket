import { CodeManagementService } from './code_management.service';
import { GenerateDto, ValidateDto, FinishDto, SubmitResponseDto } from './dto/code_management.dto';
export declare class CodeManagementController {
    private readonly service;
    constructor(service: CodeManagementService);
    generate(dto: GenerateDto): Promise<{
        code: string;
        used: boolean;
    }>;
    validate(dto: ValidateDto): Promise<{
        id_pelajar: number;
        code: string;
        used: boolean;
    }>;
    canRespond(id_pelajar: string): Promise<{
        canRespond: boolean;
    }>;
    submitResponse(dto: SubmitResponseDto): Promise<{
        id_pelajar: number;
        id_pertanyaan: number;
        skor_poin: number;
        code_used: boolean;
    }>;
    finish(dto: FinishDto): Promise<{
        id_pelajar: number;
        code: string;
        finished: boolean;
    }>;
    getAllCodes(): Promise<import("mysql2").RowDataPacket[]>;
}
