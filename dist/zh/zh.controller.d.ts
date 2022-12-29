import { ZhService } from './zh.service';
import { CreateZhDto } from './dto/create-zh.dto';
export declare class ZhController {
    private readonly zhService;
    constructor(zhService: ZhService);
    create(createZhDto: CreateZhDto, req: any): Promise<any[] | "ok">;
    findAll(query: any, req: any): Promise<{
        total: any;
        list: any;
    }>;
    checkzh(): Promise<string>;
    up(body: any, req: any): Promise<string>;
    gettask(query: any): Promise<any>;
    checktask(query: any): Promise<any>;
    upaqcode(query: any): Promise<string>;
}
