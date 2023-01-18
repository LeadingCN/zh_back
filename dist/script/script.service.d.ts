import { MysqlService } from "../utils/mysql.service";
export declare class ScriptService {
    private readonly sql;
    constructor(sql: MysqlService);
    version(query: any): Promise<{
        code: number;
        version: any;
        name: string;
        path: string;
    }>;
}
