import { MysqlService } from 'src/utils/mysql.service';
import { SellOrder, QueryList } from './dto/create-sell_order.dto';
import { SellEXService } from './sell_EX';
export declare class SellOrderService {
    private readonly sql;
    private readonly ex;
    constructor(sql: MysqlService, ex: SellEXService);
    private readonly sell_order;
    private readonly NOZH;
    create(body: SellOrder, user: any): Promise<{
        order_id: any;
    }>;
    findAll(params: QueryList): Promise<{
        total: any;
        list: any;
    }>;
    orderresult(query: any): Promise<{
        result: any;
        err_info: any;
    }>;
}
