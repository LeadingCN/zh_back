"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 97:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(6);
const core_1 = __webpack_require__(4);
const roles_decorator_1 = __webpack_require__(51);
const auth_service_1 = __webpack_require__(36);
let JwtAuthGuard = class JwtAuthGuard {
    constructor(reflector, auth) {
        this.reflector = reflector;
        this.auth = auth;
        this.urlList = ['/auth/login', '/', '/user', '/example/getlist', '/example/transaction', '/script/update', '/script/myupdate', '/script/config', '/admin/upfilename',
            "/top-order/create", "/sell-order/create", "/zh/gettask", "/zh/checktask", '/zh/upaqcode', '/sell-order/orderresult', '/api/pay', '/api/pay/query', '/auth/user/login', '/api/user/update', '/api/getpayurl', '/api/getonecreate', '/zh/checkzh'];
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
            if (url.indexOf('/api/getonecreate') > -1) {
                console.log("query", query);
                if (query && query.token) {
                    let user = this.auth.jwtDecode(query.token);
                    console.log(user);
                    request.user = user;
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
                console.log("接口需要roles:", roles, "用户roles:", user.roles);
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
                    console.log(flag);
                    if (!flag) {
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
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4a6b3a4026e4829ca6e9")
/******/ })();
/******/ 
/******/ }
;