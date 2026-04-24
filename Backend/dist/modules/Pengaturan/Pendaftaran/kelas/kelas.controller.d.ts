import { KelasService } from './kelas.service';
import { CreateKelasDto } from './dto/create-kelas.dto';
import { UpdateKelasDto } from './dto/update-kelas.dto';
export declare class KelasController {
    private readonly service;
    constructor(service: KelasService);
    create(dto: CreateKelasDto): Promise<{
        id: number;
        nama_kelas: string;
    }>;
    findAll(id_kejuruan?: string): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    }>;
    update(id: string, dto: UpdateKelasDto): Promise<{
        id: number;
        id_kejuruan: number;
        nama_kelas: string;
        nama_kejuruan: string | null;
    } | {
        affectedRows: number;
    }>;
    remove(id: string): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_kelas?: undefined;
    } | {
        id: number;
        nama_kelas: string;
        affectedRows: number;
    }>;
}
