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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAction = exports.Notify = exports.PayQuery = exports.GetPayUrl = exports.Pay = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class Pay {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '商户号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "merId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '交易金额',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '交易金额不能为空' }),
    __metadata("design:type", Object)
], Pay.prototype, "orderAmt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通道类型',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通道类型不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单描述',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单描述不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '附加信息',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '附加信息不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "attch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '扫码模式',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '扫码模式不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "smstyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户编号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户编号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '下单ip地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '下单ip地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通知地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通知地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "notifyUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '页面跳转地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '页面跳转地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "returnUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '随机字符串',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '随机字符串不能为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '随机字符串最长32位' }),
    __metadata("design:type", String)
], Pay.prototype, "nonceStr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '签名',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '签名不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "sign", void 0);
exports.Pay = Pay;
class GetPayUrl {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不等为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '订单号最长32位' }),
    __metadata("design:type", String)
], GetPayUrl.prototype, "orderid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通道类型',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通道类型不能为空' }),
    (0, class_validator_1.MaxLength)(1, { message: '通道类型最长1位' }),
    __metadata("design:type", String)
], GetPayUrl.prototype, "channel", void 0);
exports.GetPayUrl = GetPayUrl;
class PayQuery {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '商户号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "merId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '随机字符串',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '随机字符串不能为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '随机字符串最长32位' }),
    __metadata("design:type", String)
], PayQuery.prototype, "nonceStr", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '签名不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "sign", void 0);
exports.PayQuery = PayQuery;
class Notify {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "merId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '交易金额不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "orderAmt", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '我方系统单号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "sysOrderId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '系统描述不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "desc", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单状态：1为支付成功 不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '附加信息不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "attch", void 0);
exports.Notify = Notify;
class UserAction {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: 'action不能为空' }),
    __metadata("design:type", String)
], UserAction.prototype, "action", void 0);
exports.UserAction = UserAction;
//# sourceMappingURL=api.dto.js.map