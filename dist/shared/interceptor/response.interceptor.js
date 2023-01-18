"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        console.log('进入全局响应拦截...');
        return next.handle().pipe((0, operators_1.map)((data) => {
            console.log('全局响应拦截器方法返回内容后...');
            if (request.url.indexOf('/script/update') > -1) {
                return data;
            }
            else if (request.url.indexOf('/api') > -1) {
                return {
                    Code: 1,
                    code: data.code || data.code == 0 ? data.code : 1,
                    time: parseInt((new Date().getTime() / 1000).toString()),
                    data: data.data ? data.data : data,
                    msg: data.msg ? data.msg : " ",
                    url: data.url ? data.url : ''
                };
            }
            else {
                return {
                    statusCode: 200,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: '请求成功',
                    data: data,
                };
            }
        }));
    }
};
ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
exports.ResponseInterceptor = ResponseInterceptor;
//# sourceMappingURL=response.interceptor.js.map