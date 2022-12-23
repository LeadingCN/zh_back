/// <reference types="multer" />
import { Test, BodyDto, ReturnBodyDto } from './dto/test.dto';
import { ExampleService } from './example.service';
export declare class ExampleController {
    private readonly exampleService;
    constructor(exampleService: ExampleService);
    dongsave(body: any, file: Express.Multer.File): Promise<string>;
    classcreate(body: any, files: {
        file: Express.Multer.File;
        video: Express.Multer.File;
    }): Promise<string>;
    uploadFile(files: Array<Express.Multer.File>): void;
    login(b: Test, req: any): Promise<string>;
    getlist(): Promise<any>;
    transaction(): Promise<unknown>;
    body(body: BodyDto): Promise<ReturnBodyDto>;
}
