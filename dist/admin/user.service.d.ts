import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
import { RedisService } from 'src/utils/redis.service';
export declare class UserService {
    private readonly sql;
    private readonly utils;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, redis: RedisService);
    findAll(params: any): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    createuser(body: any): Promise<string>;
    topuserupdate(body: any): Promise<string>;
}
