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
const role_enum_1 = require("../shared/enums/role.enum");
const roles_decorator_1 = require("../shared/decorator/roles.decorator");
let ZhController = class ZhController {
    constructor(zhService) {
        this.zhService = zhService;
    }
    async create(createZhDto, req) {
        return await this.zhService.create(createZhDto, req.user);
    }
    async findAll(query, req) {
        return await this.zhService.findAll(query, req.user);
    }
    async checkzh() {
        return await this.zhService.checkzh();
    }
    async up(body, req) {
        return await this.zhService.up(body, req.user);
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
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.Proxy),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_zh_dto_1.CreateZhDto, Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.Proxy),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('checkzh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "checkzh", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('zhup'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.Proxy),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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