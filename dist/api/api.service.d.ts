import { TopEXService } from 'src/top_order/top_EX';
import { MysqlService } from 'src/utils/mysql.service';
import { RedisService } from 'src/utils/redis.service';
import { UtilsService } from 'src/utils/utils.service';
import { ZhExecuteService } from 'src/zh/zhexecute.service';
import { GetPayUrl, Notify, Pay, PayQuery } from './dto/api.dto';
export declare class ApiService {
    private readonly utils;
    private readonly sql;
    private readonly zhEX;
    private readonly topEX;
    private readonly redis;
    constructor(utils: UtilsService, sql: MysqlService, zhEX: ZhExecuteService, topEX: TopEXService, redis: RedisService);
    private readonly linktype;
    pay(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    } | "暂时接单">;
    RSAverify(merId: any, localsign: any, sign: any): Promise<any>;
    payqq(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payvx(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payqqRSA(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payvxRSA(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payauto(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    payquery(body: PayQuery): Promise<"ok" | "校验错误" | "查询出错,订单号错误" | {
        merId: string;
        status: number;
        orderId: any;
        sysOrderId: any;
        orderAmt: any;
        nonceStr: string;
    }>;
    notifyRequest(url: any, notify: Notify, yan: string): Promise<void>;
    payqqAgent(body: Pay): Promise<{
        code: number;
        payurl: string;
        sysorderno: string;
        orderno: string;
    }>;
    getUid(q: any): Promise<{
        linkid: any;
        uid: any;
    }>;
    amountRange(q: any): Promise<void>;
    getpayurl(body: GetPayUrl): Promise<{
        code: number;
        msg: string;
        url: string;
    }>;
    ascesign(obj: any, yan: string): string;
    testreset(): Promise<string>;
    getonecreate(b: any, user: any): Promise<any>;
}
