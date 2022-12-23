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
exports.SellOrderService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const sell_EX_1 = require("./sell_EX");
let SellOrderService = class SellOrderService {
    constructor(sql, ex) {
        this.sql = sql;
        this.ex = ex;
        this.sell_order = 'sell_order';
        this.NOZH = -1;
    }
    async create(body, user) {
        common_1.Logger.log(`创建充值订单请求 ${JSON.stringify(body)}`);
        let r = await this.sql.query(`INSERT INTO sell_order(top_zh,quota,game_type,game_qu,merchant_id,up_time) VALUES ('${body.top_zh}',${Number(body.quota) * 100},'${body.game_type}','${body.game_qu}',${body.merchant_id},now())`);
        return { order_id: r.insertId ? r.insertId : -1 };
    }
    async findAll(params) {
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.sell_order} WHERE (pay_zh LIKE '%${params.keyword ? params.keyword : ''}%' or top_zh LIKE '%${params.keyword ? params.keyword : ''}%') `);
        let r = await this.sql.query(`SELECT * FROM ${this.sell_order} WHERE (pay_zh LIKE '%${params.keyword ? params.keyword : ''}%' or top_zh LIKE '%${params.keyword ? params.keyword : ''}%') ORDER BY create_time DESC LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async orderresult(query) {
        let r = await this.sql.query(`SELECT id,result,pay_zh,top_zh,err_info FROM sell_order WHERE id = ${query.id}`);
        let result = { result: r[0] ? r[0].result : '无该订单', err_info: r[0] ? r[0].err_info : '' };
        if (r[0] && r[0].result == 1) {
            result = r[0];
            result['downurl'] = `http://z.yyeth.top/sell/${r[0].pay_zh}/${r[0].id}-${r[0].top_zh}.png`;
            delete result['pay_zh'];
        }
        return result;
    }
};
SellOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, sell_EX_1.SellEXService])
], SellOrderService);
exports.SellOrderService = SellOrderService;
//# sourceMappingURL=sell_order.service.js.map