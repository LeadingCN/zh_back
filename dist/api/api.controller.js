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
exports.ApiController = void 0;
const api_service_1 = require("./api.service");
const common_1 = require("@nestjs/common");
const validation_pipe_1 = require("../shared/pipe/validation.pipe");
const api_dto_1 = require("./dto/api.dto");
const user_service_1 = require("./user.service");
const passport_1 = require("@nestjs/passport");
let ApiController = class ApiController {
    constructor(apiService, user) {
        this.apiService = apiService;
        this.user = user;
    }
    async pay(body) {
        return await this.apiService.pay(body);
    }
    async payquery(body) {
        return await this.apiService.payquery(body);
    }
    async testreset() {
        return await this.apiService.testreset();
    }
    async update(query, req) {
        return await this.user.update(query, req.user);
    }
    async getOneCreate(body, req) {
        return await this.apiService.getonecreate(body, req.user);
    }
    async getpayurl(body) {
        return await this.apiService.getpayurl(body);
    }
};
__decorate([
    (0, common_1.Post)('pay'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pay", null);
__decorate([
    (0, common_1.Post)('/pay/query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "payquery", null);
__decorate([
    (0, common_1.Get)('/testreset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "testreset", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/user/update'),
    __param(0, (0, common_1.Query)(new validation_pipe_1.ValidationPipe())),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [api_dto_1.UserAction, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('getonecreate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getOneCreate", null);
__decorate([
    (0, common_1.Post)('getpayurl'),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [api_dto_1.GetPayUrl]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getpayurl", null);
ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService, user_service_1.UserService])
], ApiController);
exports.ApiController = ApiController;
//# sourceMappingURL=api.controller.js.map