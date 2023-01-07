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
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
let CommissionService = class CommissionService {
    constructor(sql, utils) {
        this.sql = sql;
        this.utils = utils;
        this.zh_table = 'commissionlog';
    }
    async upcommission(body) {
        return 'This action adds a new commission';
    }
    async findAll(params, user) {
        let userInfo = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${user.uid}'`);
        if (!userInfo[0]) {
            throw new common_1.HttpException("用户不存在", 400);
        }
        else {
            userInfo = userInfo[0];
        }
        let { pageNum, pageSize, dateArray, channel, merchant_id } = params;
        let createsql = '';
        if (dateArray) {
            dateArray = dateArray.split(',');
            createsql = ` AND unix_timestamp(create_time) > unix_timestamp('${this.utils.dayjsDate(dateArray[0]).format('YYYY-MM-DD HH:mm:ss')}') AND unix_timestamp(create_time) <= unix_timestamp('${this.utils.dayjsDate(dateArray[1]).format('YYYY-MM-DD HH:mm:ss')}')`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.zh_table}  WHERE create_time IS NOT NULL
       ${createsql}
      ${!channel || channel == '0' || channel == '' ? "" : ` AND channel = ${channel}`}
      ${user.roles == 'admin' ? '' : ` AND uid = '${user.uid}'`}
      `);
        let r = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE create_time IS NOT NULL
      ${createsql}
      ${!channel || channel == '0' || channel == '' ? '' : ` AND channel = ${channel}`}
      ${user.roles == 'admin' ? '' : ` AND uid = '${user.uid}' `}
      ORDER BY create_time DESC
      LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
};
CommissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, utils_service_1.UtilsService])
], CommissionService);
exports.CommissionService = CommissionService;
//# sourceMappingURL=commission.service.js.map