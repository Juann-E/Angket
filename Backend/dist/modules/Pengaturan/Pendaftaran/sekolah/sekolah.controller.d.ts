import { SekolahService } from './sekolah.service';
import { CreateSekolahDto } from './dto/create-sekolah.dto';
import { UpdateSekolahDto } from './dto/update-sekolah.dto';
export declare class SekolahController {
    private readonly service;
    constructor(service: SekolahService);
    create(dto: CreateSekolahDto): Promise<{
        id: number;
        nama_sekolah: string;
    }>;
    findAll(): Promise<{
        id: number;
        nama_sekolah: string;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        nama_sekolah: string;
    }>;
    update(id: string, dto: UpdateSekolahDto): Promise<any>;
    remove(id: string): Promise<{
        affectedRows: number;
        id?: undefined;
        nama_sekolah?: undefined;
    } | {
        id: any;
        nama_sekolah: any;
        affectedRows: number;
    }>;
}
