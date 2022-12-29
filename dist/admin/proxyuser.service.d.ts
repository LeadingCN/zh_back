import { MysqlService } from 'src/utils/mysql.service';
import { RedisService } from 'src/utils/redis.service';
import { UtilsService } from 'src/utils/utils.service';
import { ProxyUserDto, ProxyUserUpdate, UserToken } from './dto/admin.dto';
export declare class ProxyUserService {
    private readonly sql;
    private readonly utils;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, redis: RedisService);
    findAll(params: any, user: UserToken): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    createuser(body: ProxyUserDto, user: UserToken): Promise<string>;
    updateuser(body: ProxyUserUpdate, user: UserToken): Promise<string>;
    deleteuser(body: any, user: UserToken): Promise<string>;
    LVERRORLOG(user: any): void;
    isSelf(body: any, user: UserToken): Promise<void>;
    isAdminSql(user: any): "" | " AND username != 'admin'";
}
