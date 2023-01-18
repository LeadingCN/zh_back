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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorator/roles.decorator");
const auth_service_1 = require("../../auth/auth.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(reflector, auth) {
        this.reflector = reflector;
        this.auth = auth;
        this.urlList = ['/auth/login', '/', '/user', '/example/getlist', '/script/update', '/script/myupdate', '/script/config',
            "/top-order/create", "/sell-order/create", "/zh/gettask", "/zh/checktask", '/zh/upaqcode', '/sell-order/orderresult', '/api/pay', '/api/pay/query', '/auth/user/login', '/api/user/update', '/api/getpayurl'];
    }
    canActivate(context) {
        const { url, query } = context.switchToHttp().getRequest();
        var request = context.switchToHttp().getRequest();
        if (this.hasUrl(this.urlList, url)) {
            if (url.indexOf('/api/user/update') > -1) {
                if (query && query.token) {
                    request.headers['authorization'] = `Bearer ${query.token}`;
                }
            }
            return true;
        }
        const token = context.switchToRpc().getData().headers.authorization;
        console.log('进入全局守卫访问地址:', url, "携带token", token);
        if (token) {
            try {
                let user = this.auth.jwtDecode(token);
                console.log("解析的user", user);
                const roles = this.reflector.get('roles', context.getHandler());
                const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
                if (user.roles == 'admin' || !roles) {
                    return true;
                }
                else {
                    let flag = false;
                    roles.forEach(e => {
                        if (e == user.roles) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        common_1.Logger.error(`${user ? " 用户:" + user.username : "unknow "}  非法访问: ${url} ` + "接口需要roles:" + roles + "用户roles:" + user.roles);
                        throw new common_1.HttpException('没有权限', common_1.HttpStatus.UNAUTHORIZED);
                    }
                    else {
                        return true;
                    }
                }
            }
            catch (e) {
                throw new common_1.HttpException('没有授权访问,请先登录', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new common_1.HttpException('没有授权访问,请先登录', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    hasUrl(urlList, url) {
        if (url.indexOf('?') > 0) {
            url = url.split('?')[0];
        }
        let flag = false;
        if (urlList.indexOf(url) >= 0) {
            flag = true;
        }
        return flag;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, auth_service_1.AuthService])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=auth.guard.js.map