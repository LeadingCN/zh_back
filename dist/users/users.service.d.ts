import { MysqlService } from 'src/utils/mysql.service';
import { RedisService } from 'src/utils/redis.service';
import { UtilsService } from 'src/utils/utils.service';
export declare class UsersService {
    private readonly sql;
    private readonly utils;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, redis: RedisService);
    findAll(params: any): Promise<{
        total: any;
        list: any;
    }>;
}
