import { JwtService } from '@nestjs/jwt';
import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
import { User } from './dto/auth.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly utils;
    private readonly sql;
    constructor(jwtService: JwtService, utils: UtilsService, sql: MysqlService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        token: string;
        tokenHead: string;
        username: any;
        id: any;
        roles: any;
    } | {
        token: string;
        tokenHead: string;
        username?: undefined;
        id?: undefined;
        roles?: undefined;
    }>;
    jwtDecode(token: string): string | {
        [key: string]: any;
    };
    jwtDecodeByQuery(token: string): string | {
        [key: string]: any;
    };
    userlogin(query: User): Promise<{
        token: string;
    }>;
}
