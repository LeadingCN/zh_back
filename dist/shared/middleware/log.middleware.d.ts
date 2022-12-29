import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class LogMiddleware implements NestMiddleware {
    use(req: Request, resp: Response, next: Function): void;
}
