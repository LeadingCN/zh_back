import { Cache } from 'cache-manager';
export declare class RedisService {
    private cacheManager;
    constructor(cacheManager: Cache);
    get(key: any): Promise<any>;
    set(key: any, value: any, t: any): Promise<any>;
    del(key: any): Promise<any>;
    reset(): Promise<any>;
}
