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
exports.User = void 0;
const class_validator_1 = require("class-validator");
class User {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.MinLength)(3, { message: '用户名长度不能少于3位' }),
    (0, class_validator_1.MaxLength)(10, { message: '用户名最长10位' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '密码不能为空' }),
    (0, class_validator_1.MinLength)(32, { message: '密码长度不能少于6位' }),
    (0, class_validator_1.MaxLength)(32, { message: '密码最长10位' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
exports.User = User;
//# sourceMappingURL=auth.dto.js.map