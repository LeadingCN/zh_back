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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
const REQ = require('request-promise-native');
let UserService = class UserService {
    constructor(utils, sql) {
        this.utils = utils;
        this.sql = sql;
    }
    async update(query, user) {
        common_1.Logger.log(user);
        let { uid, roles, username } = user;
        let { action } = query;
        switch (action) {
            case 'getyan':
                let y = await this.sql.query(`SELECT yan FROM user WHERE id = ${uid}`);
                if (y[0]) {
                    return {
                        yan: y[0].yan
                    };
                }
                new common_1.HttpException('服务器出错', 400);
                break;
            case 'updateyan':
                let newyan = query.new.replace(/ /g, '');
                await this.sql.query(`UPDATE user SET yan = '${newyan}' WHERE id = ${uid}`);
                break;
            default:
                break;
        }
        return 'ok';
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_service_1.UtilsService, mysql_service_1.MysqlService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map