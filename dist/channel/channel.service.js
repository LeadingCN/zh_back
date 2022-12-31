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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
let ChannelService = class ChannelService {
    constructor(sql, utils) {
        this.sql = sql;
        this.utils = utils;
        this.zh_table = 'channel';
    }
    create(createChannelDto) {
    }
    async findAll(params, user) {
        let userInfo = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${user.uid}'`);
        if (!userInfo[0]) {
            throw new common_1.HttpException("用户不存在", 400);
        }
        else {
            userInfo = userInfo[0];
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.zh_table} WHERE name LIKE '%${params.keyword ? params.keyword : ''}%'
      `);
        let r = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE name LIKE '%${params.keyword ? params.keyword : ''}%' 
      LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        r.forEach(e => {
            e.rate = (Math.floor((e.rate + (Number(`${user.roles == 'admin' ? 0 : userInfo.a_pid_rate}`) + userInfo.b_pid_rate + userInfo.c_pid_rate) * 10) / 10000 * 10000) / 100).toFixed(2);
        });
        return {
            total: total[0].count,
            list: r,
        };
    }
    async upchannel(body) {
        let { action } = body;
        switch (action) {
            case "enable":
                await this.sql.query(`UPDATE ${this.zh_table} SET enable = ${body.value} WHERE id = ${body.id}`);
                break;
            case "form":
                await this.sql.query(`UPDATE ${this.zh_table} SET name = '${body.name}',rate = ${Number(body.rate) * 100} WHERE id = ${body.id}`);
                break;
            default:
                break;
        }
        return 'ok';
    }
};
ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, utils_service_1.UtilsService])
], ChannelService);
exports.ChannelService = ChannelService;
//# sourceMappingURL=channel.service.js.map