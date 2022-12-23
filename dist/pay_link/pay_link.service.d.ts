import { QueryList } from './dto/create-pay_link.dto';
import { MysqlService } from 'src/utils/mysql.service';
export declare class PayLinkService {
    private readonly sql;
    constructor(sql: MysqlService);
    private readonly mtable;
    createbyfile(body: any, user: any): Promise<{
        errls: any[];
    }>;
    findAll(params: QueryList): Promise<{
        total: any;
        list: any;
    }>;
    getonecreate(query: any): Promise<string>;
}
