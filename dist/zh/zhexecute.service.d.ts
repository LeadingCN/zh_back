import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from "../utils/utils.service";
import { RedisService } from "../utils/redis.service";
export declare class ZhExecuteService {
    private readonly sql;
    private readonly utils;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, redis: RedisService);
    private readonly zh_table;
    upquota(action: any, body: any, user: any): Promise<void>;
    upbyzh(zh: string): Promise<any>;
    checktranslist(openid: any, openkey: any, zh: any): Promise<any>;
    up(openid: any, openkey: any, zh: any): Promise<any>;
}
