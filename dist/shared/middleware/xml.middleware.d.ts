import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class XMLMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function): void;
}
