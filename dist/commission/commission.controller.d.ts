import { CommissionService } from './commission.service';
export declare class CommissionController {
    private readonly commissionService;
    constructor(commissionService: CommissionService);
    upcommission(createCommissionDto: any): Promise<string>;
    findAll(query: any, req: any): Promise<{
        total: any;
        list: any;
    }>;
}
