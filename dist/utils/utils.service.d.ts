import { MysqlService } from './mysql.service';
import { RedisService } from './redis.service';
export declare class UtilsService {
    private readonly redis;
    private readonly sql;
    constructor(redis: RedisService, sql: MysqlService);
    nowprocess: number;
    maxprocess: number;
    iscreate: boolean;
    randomString(e: any): string;
    randomNumber(min: any, max: any): number;
    md5(t: any): string;
    dayjs(): any;
    dayjsDate(date: any): any;
    HTTPGET(url: any): void;
    uuid(): any;
    guid(t: any, q: any): string;
    zhguid(): string;
    testlog: string;
    istestlog(c: any): void;
    clearData(data: any): any;
    getsetcache(key: any, time: any): Promise<any>;
    getsetcachemark(key: any, time: any): Promise<any>;
    RSAgetKeyPair(passphrase: any): any;
    RSAcreateKeyPairFile(filePath: any, passphrase: any): void;
    RSApublicEncrypt(data: any, publicKey: any, encoding: any): any;
    RSAprivateDecrypt(privateKey: any, passphrase: any, encryptBuffer: any): any;
    RSAprivateSign(privateKey: any, passphrase: any, encryptBuffer: any, encoding: any): any;
    RSApublicVerify(publicKey: any, encryptBuffer: any, signatureBuffer: any): any;
}
