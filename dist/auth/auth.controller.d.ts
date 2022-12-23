import { AuthService } from './auth.service';
import { User } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
    logout(req: any): Promise<string>;
    userlogin(query: User): Promise<{
        token: string;
    }>;
}
