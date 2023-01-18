import { MysqlService } from 'src/utils/mysql.service';
import { QueryList, TopOrder } from './dto/top_order.dto';
import { ZhExecuteService } from 'src/zh/zhexecute.service';
import { UtilsService } from 'src/utils/utils.service';
import { ApiService } from 'src/api/api.service';
import { UserToken } from 'src/admin/dto/admin.dto';
export declare class TopOrderService {
    private readonly sql;
    private readonly zhEX;
    private readonly utils;
    private readonly api;
    constructor(sql: MysqlService, zhEX: ZhExecuteService, utils: UtilsService, api: ApiService);
    private readonly order_talbe;
    private readonly NOZH;
    private readonly linktype;
    create(body: TopOrder, user: any): Promise<{
        code: number;
    }>;
    findAll(params: QueryList, user: UserToken): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    getlink(query: any, user: any): Promise<{
        code: number;
        msg: string;
        pay_link?: undefined;
        tid?: undefined;
    } | {
        code: number;
        pay_link: any;
        tid: string;
        msg?: undefined;
    }>;
    checkorder(query: any, user: UserToken): Promise<"ok" | {
        code: number;
        msg: string;
    }>;
    deleteOrder(body: any, user: UserToken): Promise<string>;
    isAdmin(user: UserToken): string;
    isSelf(query: any, user: UserToken): Promise<any>;
}
