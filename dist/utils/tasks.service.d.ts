import { MysqlService } from './mysql.service';
import { UtilsService } from './utils.service';
import { ZhExecuteService } from 'src/zh/zhexecute.service';
import { SellEXService } from 'src/sell_order/sell_EX';
import { RedisService } from './redis.service';
import { TopEXService } from 'src/top_order/top_EX';
import { ApiService } from 'src/api/api.service';
export declare class TasksService {
    private readonly sql;
    private readonly sell_ex;
    private readonly top_ex;
    private readonly zh_ex;
    private readonly utils;
    private readonly redis;
    private readonly api;
    constructor(sql: MysqlService, sell_ex: SellEXService, top_ex: TopEXService, zh_ex: ZhExecuteService, utils: UtilsService, redis: RedisService, api: ApiService);
    vx_top_order_handler(): Promise<void>;
    sell_order_task(): Promise<void>;
    handler_outtime(): Promise<void>;
    top_order_outtime_reset(): Promise<void>;
    resetZhquota_temp(): Promise<void>;
    handler_toporder(): Promise<void>;
}
