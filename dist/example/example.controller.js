"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const test_dto_1 = require("./dto/test.dto");
const example_service_1 = require("./example.service");
let ExampleController = class ExampleController {
    constructor(exampleService) {
        this.exampleService = exampleService;
    }
    async dongsave(body, file) {
        console.log('body', body);
        console.log('file', file);
        return '';
    }
    async classcreate(body, files) {
        return 'ok';
    }
    uploadFile(files) {
        console.log(files);
    }
    async login(b, req) {
        console.log(b);
        return '';
    }
    async getlist() {
        return this.exampleService.getlist();
    }
    async transaction() {
        let r = await this.exampleService.transactionTest();
        console.log(r);
        return r;
    }
    async body(body) {
        let a = {
            username: 'BodyDto',
            password: '1123127',
        };
        return a;
    }
};
__decorate([
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_2.Post)('/dongsave'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "dongsave", null);
__decorate([
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_2.Post)('/classcreate'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ])),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "classcreate", null);
__decorate([
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_2.Post)('/classcreate'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "uploadFile", null);
__decorate([
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_2.Post)('/login'),
    (0, common_2.UsePipes)(new common_2.ValidationPipe()),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_dto_1.Test, Object]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('getlist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "getlist", null);
__decorate([
    (0, common_1.Get)('transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "transaction", null);
__decorate([
    (0, swagger_1.ApiTags)('请求参数详细说明例子'),
    (0, common_1.Get)('API'),
    (0, swagger_1.ApiResponse)({ description: "响应注释", type: test_dto_1.ReturnBodyDto }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_dto_1.BodyDto]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "body", null);
ExampleController = __decorate([
    (0, swagger_1.ApiTags)('例子'),
    (0, common_2.Controller)('example'),
    __metadata("design:paramtypes", [example_service_1.ExampleService])
], ExampleController);
exports.ExampleController = ExampleController;
//# sourceMappingURL=example.controller.js.map