export declare class CreateZhDto {
    filenamelist: Array<UpFileDto>;
}
export declare class UpFileDto {
    localname: string;
    filename: string;
}
export declare class ZhDto {
    zid: string;
    zh: string;
    cookie: string;
    quota: number;
    enable: number;
    is_delete: number;
    action: string;
    list: any;
    mark: string;
}
export declare class ZhDtoList {
    id: number;
    zh: string;
    cookie: string;
    quota: number;
    quota_temp: number;
    quota_total: number;
    balance: number;
    is_delete: number;
}
export declare class QueryList {
    keyword: string;
    pageNum: number;
    pageSize: number;
    channelsub: string;
}
export declare class ZH {
    id: number;
    zh: string;
    cookie: string;
    quota: number;
    quota_temp: number;
    quota_total: number;
    balance: number;
    balance_lock: number;
    aq_code: string;
    aq_code_last_up_time: string;
    aq_code_is_use: number;
    is_delete: number;
    create_time: string;
    up_time: string;
    enable: number;
}
