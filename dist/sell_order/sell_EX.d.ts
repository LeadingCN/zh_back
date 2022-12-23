import { MysqlService } from 'src/utils/mysql.service';
import { RedisService } from 'src/utils/redis.service';
import { UtilsService } from 'src/utils/utils.service';
import { ZH } from 'src/zh/dto/create-zh.dto';
import { ZhExecuteService } from 'src/zh/zhexecute.service';
import { SellOrder } from './dto/create-sell_order.dto';
export declare class SellEXService {
    private readonly sql;
    private readonly utils;
    private readonly zhEX;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, zhEX: ZhExecuteService, redis: RedisService);
    private readonly sell_order;
    private readonly NOZH;
    private processLs;
    create(body: SellOrder, zh: ZH): Promise<any>;
    killprocess(zh: any): any;
}
