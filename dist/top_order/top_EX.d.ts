import { MysqlService } from 'src/utils/mysql.service';
import { RedisService } from 'src/utils/redis.service';
import { UtilsService } from 'src/utils/utils.service';
import { ZhExecuteService } from 'src/zh/zhexecute.service';
export declare class TopEXService {
    private readonly sql;
    private readonly utils;
    private readonly zhEX;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, zhEX: ZhExecuteService, redis: RedisService);
    private readonly sell_order;
    private readonly top_order;
    private readonly NOZH;
    private processLs;
    create(zh: any, quota: any, channel: any, topid: any, isautocreate?: boolean): Promise<any>;
    killprocess(zh: any): any;
}
