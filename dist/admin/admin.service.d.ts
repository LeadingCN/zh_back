import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
import { Admin, Setting } from './dto/admin.dto';
import { RedisService } from 'src/utils/redis.service';
export declare class AdminService {
    private readonly sql;
    private readonly utils;
    private readonly redis;
    constructor(sql: MysqlService, utils: UtilsService, redis: RedisService);
    info(user: any): Promise<{
        icon: string;
        menus: any;
        roles: any;
        username: any;
    }>;
    list(): Promise<any>;
    statictotal(): Promise<any>;
    create(body: Admin): Promise<string>;
    up(body: any): Promise<string>;
    deluser(body: any): Promise<void>;
    repass(body: any, user: any): Promise<string>;
    upfilename(file: any): Promise<{
        filename: string;
    }>;
    setting(body: Setting): Promise<any>;
}
