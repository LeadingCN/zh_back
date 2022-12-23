import { ZhService } from './zh.service';
import { CreateZhDto } from './dto/create-zh.dto';
export declare class ZhController {
    private readonly zhService;
    constructor(zhService: ZhService);
    create(createZhDto: CreateZhDto): Promise<any[] | "ok">;
    findAll(query: any): Promise<{
        total: any;
        list: any;
    }>;
    up(body: any): Promise<string>;
    gettask(query: any): Promise<any>;
    checktask(query: any): Promise<any>;
    upaqcode(query: any): Promise<string>;
}
