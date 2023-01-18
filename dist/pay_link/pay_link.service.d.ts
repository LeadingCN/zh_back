import { QueryList } from './dto/create-pay_link.dto';
import { MysqlService } from 'src/utils/mysql.service';
import { UserToken } from 'src/admin/dto/admin.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class PayLinkService {
    private readonly sql;
    private readonly utils;
    constructor(sql: MysqlService, utils: UtilsService);
    private readonly mtable;
    createbyfile(body: any, user: UserToken): Promise<{
        errls: any[];
    }>;
    findAll(params: QueryList, user: UserToken): Promise<{
        total: any;
        list: any;
    }>;
    deletelink(body: any, user: UserToken): Promise<string>;
    getonecreate(query: any): Promise<string>;
    isAdmin(user: UserToken): string;
}
