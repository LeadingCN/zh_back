"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlMiddleware = void 0;
const common_1 = require("@nestjs/common");
var { escape } = require('mysql');
let MysqlMiddleware = class MysqlMiddleware {
    use(req, resp, next) {
        if (req.method == 'GET') {
            Object.keys(req.query).forEach(key => {
                req.query[key] = req.query[key].toString().replace(/\s+/g, '');
                let num = Number(req.query[key]);
                if (isNaN(num)) {
                    req.query[key] = escape(req.query[key]);
                    req.query[key] = req.query[key].toString().replace(/'/g, '');
                    req.query[key] = req.query[key].toString().replace(/;|select|update|delete|insert|from/g, '');
                }
            });
        }
        else if (req.method == 'POST') {
            Object.keys(req.body).forEach(key => {
                req.body[key] = req.body[key].toString().replace(/\s+/g, '');
                let num = Number(req.body[key]);
                if (isNaN(num)) {
                    req.body[key] = escape(req.body[key]);
                    req.body[key] = req.body[key].toString().replace(/'/g, '');
                    req.body[key] = req.body[key].toString().replace(/;|select|update|delete|insert|from/g, '');
                }
            });
        }
        next();
    }
};
MysqlMiddleware = __decorate([
    (0, common_1.Injectable)()
], MysqlMiddleware);
exports.MysqlMiddleware = MysqlMiddleware;
//# sourceMappingURL=mysql.middleware.js.map