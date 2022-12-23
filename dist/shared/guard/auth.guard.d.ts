import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private auth;
    constructor(reflector: Reflector, auth: AuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private urlList;
    private hasUrl;
}
