export declare class Pay {
    merId: string;
    orderId: string;
    orderAmt: any;
    channel: string;
    desc: string;
    attch: string;
    smstyle: string;
    userId: string;
    ip: string;
    notifyUrl: string;
    returnUrl: string;
    nonceStr: string;
    sign: string;
}
export declare class GetPayUrl {
    orderid: string;
    channel: string;
}
export declare class PayQuery {
    merId: string;
    orderId: string;
    nonceStr: string;
    sign: string;
}
export declare class Notify {
    merId: string;
    orderId: string;
    orderAmt: string;
    sysOrderId: string;
    desc: string;
    status: string;
    attch: string;
    nonceStr: string;
}
export declare class UserAction {
    action: string;
    yan: string;
    new: string;
}
