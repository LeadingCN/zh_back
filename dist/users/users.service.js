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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const redis_service_1 = require("../utils/redis.service");
const utils_service_1 = require("../utils/utils.service");
let UsersService = class UsersService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async findAll(params) {
        let { keyword, pageNum, pageSize, queryType } = params;
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM adminuser WHERE zh LIKE '%${keyword ? keyword : ''}%'${queryTypesql}  AND is_delete = 0 `);
        let r = await this.sql.query(`SELECT * FROM adminuser WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%')
      ${queryTypesql}
       AND is_delete = 0
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        utils_service_1.UtilsService,
        redis_service_1.RedisService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map