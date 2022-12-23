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
exports.PayLinkController = void 0;
const common_1 = require("@nestjs/common");
const pay_link_service_1 = require("./pay_link.service");
const create_pay_link_dto_1 = require("./dto/create-pay_link.dto");
const passport_1 = require("@nestjs/passport");
let PayLinkController = class PayLinkController {
    constructor(payLinkService) {
        this.payLinkService = payLinkService;
    }
    async createbyfile(body, req) {
        return await this.payLinkService.createbyfile(body, req.user);
    }
    async findAll(query) {
        return await this.payLinkService.findAll(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('createbyfile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PayLinkController.prototype, "createbyfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pay_link_dto_1.QueryList]),
    __metadata("design:returntype", Promise)
], PayLinkController.prototype, "findAll", null);
PayLinkController = __decorate([
    (0, common_1.Controller)('pay-link'),
    __metadata("design:paramtypes", [pay_link_service_1.PayLinkService])
], PayLinkController);
exports.PayLinkController = PayLinkController;
//# sourceMappingURL=pay_link.controller.js.map