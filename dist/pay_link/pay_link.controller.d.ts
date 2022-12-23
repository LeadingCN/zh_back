import { PayLinkService } from './pay_link.service';
import { QueryList } from './dto/create-pay_link.dto';
export declare class PayLinkController {
    private readonly payLinkService;
    constructor(payLinkService: PayLinkService);
    createbyfile(body: any, req: any): Promise<{
        errls: any[];
    }>;
    findAll(query: QueryList): Promise<{
        total: any;
        list: any;
    }>;
}
