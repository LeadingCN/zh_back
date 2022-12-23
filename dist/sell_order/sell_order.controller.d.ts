import { SellOrderService } from './sell_order.service';
import { QueryList, SellOrder } from './dto/create-sell_order.dto';
export declare class SellOrderController {
    private readonly sellOrderService;
    constructor(sellOrderService: SellOrderService);
    create(createSellOrderDto: SellOrder, req: any): Promise<{
        order_id: any;
    }>;
    findAll(qeury: QueryList): Promise<{
        total: any;
        list: any;
    }>;
    orderresult(query: any): Promise<{
        result: any;
        err_info: any;
    }>;
}
