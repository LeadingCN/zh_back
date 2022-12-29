/// <reference types="multer" />
import { AdminService } from './admin.service';
import { Admin, ProxyUserDto, ProxyUserUpdate, Setting } from './dto/admin.dto';
import { ProxyUserService } from './proxyuser.service';
import { UserService } from './user.service';
export declare class AdminController {
    private readonly adminService;
    private readonly userService;
    private readonly proxyUser;
    constructor(adminService: AdminService, userService: UserService, proxyUser: ProxyUserService);
    info(req: any): Promise<{
        icon: string;
        menus: any[];
        roles: any;
        username: any;
        quota: any;
        rate: any;
        uprate: any;
        lv: any;
    }>;
    list(): Promise<any>;
    statictotal(req: any): Promise<any>;
    create(body: Admin): Promise<string>;
    delete(body: any): Promise<void>;
    up(body: any): Promise<string>;
    repass(body: any, req: any): Promise<string>;
    upfilename(file: Express.Multer.File, req: any): Promise<{
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
    proxyFindAll(query: any, req: any): Promise<{
        total: any;
        quotatotal: any;
        list: any;
    }>;
    proxycreateuser(body: ProxyUserDto, req: any): Promise<string>;
    proxyuserupdate(body: ProxyUserUpdate, req: any): Promise<string>;
    proxyuserdelete(body: any, req: any): Promise<string>;
}
