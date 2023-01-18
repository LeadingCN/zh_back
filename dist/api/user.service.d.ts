import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
import { UserAction } from './dto/api.dto';
export declare class UserService {
    private readonly utils;
    private readonly sql;
    constructor(utils: UtilsService, sql: MysqlService);
    update(query: UserAction, user: any): Promise<"ok" | {
        yan: any;
    }>;
}
