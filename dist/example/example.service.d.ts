import { MysqlService } from 'src/utils/mysql.service';
export declare class ExampleService {
    private readonly sql;
    constructor(sql: MysqlService);
    getlist(): Promise<any>;
    transactionTest(): Promise<unknown>;
}
