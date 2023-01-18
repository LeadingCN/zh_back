import { UserToken } from 'src/admin/dto/admin.dto';
import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
export declare class CommissionService {
    private readonly sql;
    private readonly utils;
    constructor(sql: MysqlService, utils: UtilsService);
    private zh_table;
    upcommission(body: any): Promise<string>;
    findAll(params: any, user: UserToken): Promise<{
        total: any;
        list: any;
    }>;
}
