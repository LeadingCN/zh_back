export declare class MysqlService {
    private getConnection;
    query(sql: any): Promise<any>;
    private transactionQuery;
    transaction(sql: string[]): Promise<unknown>;
}
