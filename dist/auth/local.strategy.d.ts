import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ModuleRef } from '@nestjs/core';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    private moduleRef;
    constructor(authService: AuthService, moduleRef: ModuleRef);
    validate(headers: any, username: string, password: string): Promise<any>;
}
export {};
