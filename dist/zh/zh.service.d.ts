import { MysqlService } from 'src/utils/mysql.service';
import { CreateZhDto, QueryList, ZhDto } from './dto/create-zh.dto';
import { ZhExecuteService } from './zhexecute.service';
import { UtilsService } from 'src/utils/utils.service';
import { SellEXService } from 'src/sell_order/sell_EX';
import { UserToken } from 'src/admin/dto/admin.dto';
export declare class ZhService {
    private readonly sql;
    private readonly ex;
    private readonly utils;
    private readonly sell_EX;
    constructor(sql: MysqlService, ex: ZhExecuteService, utils: UtilsService, sell_EX: SellEXService);
    private readonly zh_table;
    create(body: CreateZhDto, user: UserToken): Promise<any[] | "ok">;
    findAll(params: QueryList, user: UserToken): Promise<{
        total: any;
        list: any;
    }>;
    up(body: ZhDto, user: UserToken): Promise<string>;
    checkzh(): Promise<string>;
    checkzhScript(): Promise<void>;
    gettask(query: any): Promise<any>;
    checktask(query: any): Promise<any>;
    upaqcode(query: any): Promise<string>;
    isAdmin(user: UserToken): string;
    isSelf(body: any, user: UserToken): Promise<void>;
    clearData(data: any): any;
}
