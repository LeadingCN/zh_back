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
exports.SellOrderController = void 0;
const common_1 = require("@nestjs/common");
const sell_order_service_1 = require("./sell_order.service");
const create_sell_order_dto_1 = require("./dto/create-sell_order.dto");
const passport_1 = require("@nestjs/passport");
let SellOrderController = class SellOrderController {
    constructor(sellOrderService) {
        this.sellOrderService = sellOrderService;
    }
    async create(createSellOrderDto, req) {
        return await this.sellOrderService.create(createSellOrderDto, req.user);
    }
    async findAll(qeury) {
        return await this.sellOrderService.findAll(qeury);
    }
    async orderresult(query) {
        return await this.sellOrderService.orderresult(query);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sell_order_dto_1.SellOrder, Object]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sell_order_dto_1.QueryList]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('orderresult'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "orderresult", null);
SellOrderController = __decorate([
    (0, common_1.Controller)('sell-order'),
    __metadata("design:paramtypes", [sell_order_service_1.SellOrderService])
], SellOrderController);
exports.SellOrderController = SellOrderController;
//# sourceMappingURL=sell_order.controller.js.map