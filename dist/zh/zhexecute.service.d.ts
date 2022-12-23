import { MysqlService } from 'src/utils/mysql.service';
export declare class ZhExecuteService {
    private readonly sql;
    constructor(sql: MysqlService);
    private readonly zh_table;
    upquota(action: any, body: any): Promise<void>;
    upbyzh(zh: string): Promise<any>;
    checktranslist(openid: any, openkey: any, zh: any): Promise<any>;
    up(openid: any, openkey: any, zh: any): Promise<any>;
}
