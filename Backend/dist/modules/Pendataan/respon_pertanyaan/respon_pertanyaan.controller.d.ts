import { ResponPertanyaanService } from './respon_pertanyaan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SubmitResponDto, FindResultsFilterDto } from './dto/respon_pertanyaan.dto';
export declare class ResponPertanyaanController {
    private readonly service;
    private readonly jwtService;
    private readonly configService;
    constructor(service: ResponPertanyaanService, jwtService: JwtService, configService: ConfigService);
    submit(dto: SubmitResponDto, req: {
        headers: {
            authorization?: string | string[];
        };
    }): Promise<{
        id_pelajar: number;
        total_skor: number;
        level_sdness: "Low" | "Moderate" | "High";
    }>;
    resultOne(id_pelajar: string): Promise<{
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
    results(query: FindResultsFilterDto): Promise<{
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
}
