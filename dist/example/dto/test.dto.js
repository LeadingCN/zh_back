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
exports.ReturnBodyDto = exports.BodyDto = exports.APITEST = exports.Test = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class Test {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.Contains)('hello', { message: '必须包含此关键字' }),
    (0, class_validator_1.MinLength)(6, { message: '用户名长度不能少于6位' }),
    (0, class_validator_1.Length)(3, 5, { message: '最少多少位最多多少位' }),
    (0, class_validator_1.IsInt)({ message: '不是整数' }),
    (0, class_validator_1.IsEmail)({ message: '不是邮箱' }),
    (0, class_validator_1.IsNotEmpty)({ message: '不能为空' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: '内容数组元素最少要有1个' }),
    (0, class_validator_1.IsDate)({ message: '该字段不是一个日期' }),
    (0, class_validator_1.IsFQDN)('www.baidu.com', { message: '完全限定域名' }),
    __metadata("design:type", String)
], Test.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6, { message: '密码长度不能少于6位' }),
    __metadata("design:type", String)
], Test.prototype, "password", void 0);
exports.Test = Test;
class APITEST {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '注释',
        required: true,
    }),
    __metadata("design:type", String)
], APITEST.prototype, "username", void 0);
exports.APITEST = APITEST;
class BodyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '注释',
        minLength: 5,
        maxLength: 10
    }),
    __metadata("design:type", String)
], BodyDto.prototype, "username", void 0);
exports.BodyDto = BodyDto;
class ReturnBodyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '注释',
        minLength: 5,
    }),
    __metadata("design:type", String)
], ReturnBodyDto.prototype, "username", void 0);
exports.ReturnBodyDto = ReturnBodyDto;
//# sourceMappingURL=test.dto.js.map