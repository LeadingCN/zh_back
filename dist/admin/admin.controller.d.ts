/// <reference types="multer" />
import { AdminService } from './admin.service';
import { Admin, Setting } from './dto/admin.dto';
import { UserService } from './user.service';
export declare class AdminController {
    private readonly adminService;
    private readonly userService;
    constructor(adminService: AdminService, userService: UserService);
    info(req: any): Promise<{
        icon: string;
        menus: any;
        roles: any;
        username: any;
    }>;
    list(): Promise<any>;
    statictotal(): Promise<any>;
    create(body: Admin): Promise<string>;
    delete(body: any): Promise<void>;
    up(body: any): Promise<string>;
    repass(body: any, req: any): Promise<string>;
    upfilename(file: Express.Multer.File): Promise<{
        filename: string;
    }>;
    setting(body: Setting): Promise<any>;
    findAll(query: any): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    createuser(body: any): Promise<string>;
    topuserupdate(body: any): Promise<string>;
}
