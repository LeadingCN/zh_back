export declare class Admin {
    username: string;
    nickname: string;
    password: string;
    note: string;
}
export declare class UserToken {
    username: string;
    uid: number;
    roles: string;
    lv: number;
}
export declare class StaticTotal {
    topordertodaytotal: string;
    toporderyesterdaytotal: string;
    toptodaytotal: string;
    topyesterdaytotal: string;
    payordertodaytotal: string;
    payorderyesterdaytotal: string;
    paytodaytotal: string;
    payyesterdaytotal: string;
    zhtotal: string;
    linktotal: string;
    toptotal: string;
    linktotalclass: any;
}
export declare class Setting {
    action: string;
    data: any;
}
export declare class ProxyUserDto {
    username: string;
    password: string;
    nickName: string;
    rate: number;
}
export declare class ProxyUserUpdate {
    action: string;
    quota: number;
    uid: string;
    rate: number;
}
