"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.log('进入全局异常过滤器...', exception);
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message || null;
        let msgLog = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: '请求失败',
            data: message,
        };
        let t = new Date();
        common_1.Logger.error(`${request.headers['x-forwarded-for']} 在 ${t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()}发起错误请求 请求路径: ${msgLog.path}`);
        if (request.url.toString().indexOf('/api') > -1) {
            let msgLogPay = {
                Code: status,
                timestamp: parseInt((new Date().getTime() / 1000).toString()),
                path: request.url,
                msg: message.indexOf('no such file or directory') > -1 ? '请求出错' : message,
                data: message.indexOf('no such file or directory') > -1 ? '请求出错' : message,
            };
            response.status(status).json(msgLogPay);
        }
        else {
            let msgLogV2 = {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: status == 500 ? '请求失败' : message,
                data: status == 500 ? '请求失败' : message,
            };
            response.status(status).json(msgLogV2);
        }
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map