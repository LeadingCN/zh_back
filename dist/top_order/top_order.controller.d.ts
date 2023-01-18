import { TopOrderService } from './top_order.service';
import { QueryList, TopOrder } from './dto/top_order.dto';
export declare class TopOrderController {
    private readonly topOrderService;
    constructor(topOrderService: TopOrderService);
    create(createTopOrderDto: TopOrder, req: any): Promise<{
        code: number;
    }>;
    findAll(query: QueryList, req: any): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    getlink(query: any, req: any): Promise<{
        code: number;
        msg: string;
        pay_link?: undefined;
        tid?: undefined;
    } | {
        code: number;
        pay_link: any;
        tid: string;
        msg?: undefined;
    }>;
    checkorder(query: any, req: any): Promise<"ok" | {
        code: number;
        msg: string;
    }>;
    deleteorder(body: any, req: any): Promise<string>;
}
