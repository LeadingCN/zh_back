import { MysqlService } from 'src/utils/mysql.service';
import { CreateZhDto, QueryList, ZhDto } from './dto/create-zh.dto';
import { ZhExecuteService } from './zhexecute.service';
import { UtilsService } from 'src/utils/utils.service';
export declare class ZhService {
    private readonly sql;
    private readonly ex;
    private readonly utils;
    constructor(sql: MysqlService, ex: ZhExecuteService, utils: UtilsService);
    private readonly zh_table;
    create(body: CreateZhDto): Promise<any[] | "ok">;
    findAll(params: QueryList): Promise<{
        total: any;
        list: any;
    }>;
    up(body: ZhDto): Promise<string>;
    gettask(query: any): Promise<any>;
    checktask(query: any): Promise<any>;
    upaqcode(query: any): Promise<string>;
}
