import { KejuruanService } from './kejuruan.service';
import { CreateKejuruanDto } from './dto/create-kejuruan.dto';
import { UpdateKejuruanDto } from './dto/update-kejuruan.dto';
export declare class KejuruanController {
    private readonly service;
    constructor(service: KejuruanService);
    create(dto: CreateKejuruanDto): Promise<{
        id: number;
        kejuruan: string;
    }>;
    findAll(id_sekolah?: string): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    }>;
    update(id: string, dto: UpdateKejuruanDto): Promise<{
        id: number;
        id_sekolah: number;
        nama_kejuruan: string;
        nama_sekolah: string | null;
    } | {
        affectedRows: number;
    }>;
    remove(id: string): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_kejuruan?: undefined;
    } | {
        id: number;
        nama_kejuruan: string;
        affectedRows: number;
    }>;
}
