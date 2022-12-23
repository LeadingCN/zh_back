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
exports.ZhController = void 0;
const common_1 = require("@nestjs/common");
const zh_service_1 = require("./zh.service");
const create_zh_dto_1 = require("./dto/create-zh.dto");
const passport_1 = require("@nestjs/passport");
let ZhController = class ZhController {
    constructor(zhService) {
        this.zhService = zhService;
    }
    async create(createZhDto) {
        return await this.zhService.create(createZhDto);
    }
    async findAll(query) {
        return await this.zhService.findAll(query);
    }
    async up(body) {
        return await this.zhService.up(body);
    }
    async gettask(query) {
        return await this.zhService.gettask(query);
    }
    async checktask(query) {
        return await this.zhService.checktask(query);
    }
    async upaqcode(query) {
        return await this.zhService.upaqcode(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('zhcreate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_zh_dto_1.CreateZhDto]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('zhup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "up", null);
__decorate([
    (0, common_1.Get)('gettask'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "gettask", null);
__decorate([
    (0, common_1.Get)('checktask'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "checktask", null);
__decorate([
    (0, common_1.Get)('upaqcode'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "upaqcode", null);
ZhController = __decorate([
    (0, common_1.Controller)('zh'),
    __metadata("design:paramtypes", [zh_service_1.ZhService])
], ZhController);
exports.ZhController = ZhController;
//# sourceMappingURL=zh.controller.js.map