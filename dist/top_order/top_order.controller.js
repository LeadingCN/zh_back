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
exports.TopOrderController = void 0;
const common_1 = require("@nestjs/common");
const top_order_service_1 = require("./top_order.service");
const top_order_dto_1 = require("./dto/top_order.dto");
const passport_1 = require("@nestjs/passport");
let TopOrderController = class TopOrderController {
    constructor(topOrderService) {
        this.topOrderService = topOrderService;
    }
    async create(createTopOrderDto, req) {
        return await this.topOrderService.create(createTopOrderDto, req.user);
    }
    async findAll(query, req) {
        return await this.topOrderService.findAll(query, req.user);
    }
    async getlink(query, req) {
        return await this.topOrderService.getlink(query, req.user);
    }
    async checkorder(query, req) {
        return await this.topOrderService.checkorder(query, req.user);
    }
    async deleteorder(body, req) {
        return await this.topOrderService.deleteOrder(body, req.user);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [top_order_dto_1.TopOrder, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [top_order_dto_1.QueryList, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('getlink'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "getlink", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('checkorder'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "checkorder", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('deleteorder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "deleteorder", null);
TopOrderController = __decorate([
    (0, common_1.Controller)('top-order'),
    __metadata("design:paramtypes", [top_order_service_1.TopOrderService])
], TopOrderController);
exports.TopOrderController = TopOrderController;
//# sourceMappingURL=top_order.controller.js.map