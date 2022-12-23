import { ApiService } from './api.service';
import { GetPayUrl, UserAction } from './dto/api.dto';
import { UserService } from './user.service';
export declare class ApiController {
    private readonly apiService;
    private readonly user;
    constructor(apiService: ApiService, user: UserService);
    pay(body: any): Promise<"暂时接单" | {
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payquery(body: any): Promise<"ok" | "校验错误" | "查询出错,订单号错误" | {
        merId: string;
        status: number;
        orderId: any;
        sysOrderId: any;
        orderAmt: any;
        nonceStr: string;
    }>;
    testreset(): Promise<string>;
    update(query: UserAction, req: any): Promise<"ok" | {
        yan: any;
    }>;
    getOneCreate(body: any, req: any): Promise<any>;
    getpayurl(body: GetPayUrl): Promise<{
        code: number;
        msg: string;
        url: string;
    }>;
}
