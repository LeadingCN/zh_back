import { MysqlService } from 'src/utils/mysql.service';
import { ScriptService } from './script.service';
export declare class ScriptController {
    private readonly scriptService;
    private readonly sql;
    constructor(scriptService: ScriptService, sql: MysqlService);
    update(query: any): Promise<{
        download_url: any;
        version: any;
        dialog: boolean;
        msg: string;
        force: boolean;
        download_timeout: number;
    }>;
    myupdate(query: any): Promise<{}>;
    config(query: any): Promise<{}>;
    winversion(query: any): Promise<{
        code: number;
        version: any;
        name: string;
        path: string;
    }>;
}
