import { PertanyaanService } from './pertanyaan.service';
import { CreatePertanyaanDto } from './dto/create-pertanyaan.dto';
import { UpdatePertanyaanDto } from './dto/update-pertanyaan.dto';
export declare class PertanyaanController {
    private readonly service;
    constructor(service: PertanyaanService);
    create(dto: CreatePertanyaanDto): Promise<{
        id: number;
    }>;
    findAll(): Promise<{
        id: number;
        isi_pertanyaan: string;
        kategori: string;
        tipe_soal: string;
        bobot_persentase: number;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        isi_pertanyaan: string;
        kategori: string;
        tipe_soal: string;
        bobot_persentase: number;
    }>;
    update(id: string, dto: UpdatePertanyaanDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        affectedRows: number;
    }>;
}
