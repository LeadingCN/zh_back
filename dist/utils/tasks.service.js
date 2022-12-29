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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mysql_service_1 = require("./mysql.service");
const utils_service_1 = require("./utils.service");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const sell_EX_1 = require("../sell_order/sell_EX");
const os = require("os");
const redis_service_1 = require("./redis.service");
const top_EX_1 = require("../top_order/top_EX");
const api_service_1 = require("../api/api.service");
let TasksService = class TasksService {
    constructor(sql, sell_ex, top_ex, zh_ex, utils, redis, api) {
        this.sql = sql;
        this.sell_ex = sell_ex;
        this.top_ex = top_ex;
        this.zh_ex = zh_ex;
        this.utils = utils;
        this.redis = redis;
        this.api = api;
        this.utils.maxprocess = os.cpus().length;
        common_1.Logger.log('Task =>' + `have ${this.utils.maxprocess} cpu,run ${this.utils.nowprocess} cpu`);
    }
    async vx_top_order_handler() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        if (this.utils.nowprocess < this.utils.maxprocess) {
            let outtime = await this.utils.getsetcache('order_outtime', 60);
            let toparr = [
                `SET @uids := null;`,
                `UPDATE top_order SET  create_status = 2 
         WHERE is_delete = 0 AND channel = 2  AND unix_timestamp(NOW())-unix_timestamp(create_time) < ${outtime} AND create_status = 0 AND result = 2
         AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1;`,
                `SELECT * FROM top_order WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(toparr);
            if (r.result && r.data[0]) {
                common_1.Logger.log('有尚未处理的微信订单');
                r = r.data[0];
                let vx_bock_time = await this.utils.getsetcache('vx_bock_time', 120);
                let arr = [
                    `SET @uids := null;`,
                    `UPDATE zh SET  balance_lock = 1 ,lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${vx_bock_time})
         WHERE is_delete = 0 AND enable = 1 AND quota >=${r.quota} AND quota-quota_temp >= ${r.quota} AND balance_lock = 0 
         AND zh not in (SELECT zh FROM paylink WHERE channel = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1;`,
                    `SELECT * FROM zh WHERE id IN (@uids);`,
                ];
                let zhData = await this.sql.transaction(arr);
                if (zhData.data[0]) {
                    common_1.Logger.log('有可用于vx链接支付的账号');
                    this.top_ex.create(zhData.data[0], r.quota, 2, r.tid);
                }
            }
        }
    }
    async sell_order_task() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        if (this.utils.nowprocess < this.utils.maxprocess) {
            let checkorder = [
                `SET @uids := null;`,
                `UPDATE sell_order SET result = 2 WHERE isNULL(pay_zh) and result = 0 AND is_delete = 0  AND unix_timestamp(NOW())-unix_timestamp(create_time) < 180 AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM sell_order WHERE id IN (@uids) ;`,
            ];
            let r = await this.sql.transaction(checkorder);
            if (r.result && r.data[0]) {
                let s_order = {
                    top_zh: r.data[0].top_zh,
                    game_type: r.data[0].game_type,
                    game_qu: r.data[0].game_qu,
                    quota: r.data[0].quota / 100,
                    merchant_id: r.data[0].merchant_id,
                    sellid: r.data[0].id
                };
                let checkZH = [
                    `SET @uids := null;`,
                    `UPDATE zh SET balance = balance - ${Number(s_order.quota) * 100} ,	balance_lock = 1,lock_time = now() WHERE is_delete = 0 AND balance - ${s_order.quota * 100} > 0 AND 	balance_lock = 0 AND enable = 1  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                    `SELECT * FROM zh WHERE id IN (@uids) ;`,
                ];
                let zh = await this.sql.transaction(checkZH);
                if (zh.result && zh.data[0]) {
                    let zhData = zh.data[0];
                    common_1.Logger.log('Task =>' + "match zh:" + zhData.zh + ',update order ');
                    let n = await this.zh_ex.upbyzh(zhData.zh);
                    common_1.Logger.log(n);
                    if (Number(n) > s_order.quota * 100) {
                        await this.sql.query(`UPDATE sell_order SET pay_zh = '${zhData.zh}',before_quota=${zhData.balance + Number(s_order.quota) * 100},result = 2,err_info=NULL WHERE id = ${r.data[0].id}`);
                        common_1.Logger.log('Task =>' + "action");
                        this.sell_ex.create(s_order, zhData);
                    }
                    else {
                    }
                }
                else {
                    common_1.Logger.log('Task =>' + `no zh,sell_id => ${r.data[0].id} quota=> ${r.data[0].quota} ,order reset`);
                    setTimeout(() => {
                        this.sql.query(`UPDATE sell_order set result = -1 ,up_time = '0000-00-00 00:00:00',err_info='库存不足' WHERE id = ${r.data[0].id}`);
                    }, 10 * 1000);
                }
            }
        }
    }
    async handler_outtime() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let sell_order_outtime = `UPDATE sell_order set result = -1 ,err_info='系统判断超时' WHERE result =2 and  unix_timestamp(NOW())-unix_timestamp(up_time) > 300`;
        let task_outtime = `UPDATE task set status = -1 ,err_info='系统判断超时' WHERE status =2 and  unix_timestamp(NOW())-unix_timestamp(up_time) > 300`;
        await this.sql.query(sell_order_outtime);
        await this.sql.query(task_outtime);
        let outtiemls = await this.sql.query(`SELECT * FROM zh WHERE balance_lock = 1 AND unix_timestamp(NOW())-unix_timestamp(lock_time) > 300`);
        if (outtiemls.length > 0) {
            for (let i = 0; i < outtiemls.length; i++) {
                await this.zh_ex.upquota('one', outtiemls[i], 0);
                await this.sql.query(`UPDATE zh SET lock_time = now(),balance_lock = 0 WHERE id = ${outtiemls[i].id}`);
                let r = this.sell_ex.killprocess(outtiemls[i].zh);
                if (r) {
                    common_1.Logger.log('Task =>' + `outtime process:${outtiemls[i].zh}  close success`);
                }
            }
        }
    }
    async top_order_outtime_reset() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let t1 = new Date().getTime();
        let r2 = await this.sql.query(`SELECT * FROM top_order WHERE result = 2 AND is_delete = 0 AND create_status = 1`);
        if (r2[0]) {
            for (let i = 0; i < r2.length; i++) {
                let yan = "";
                if (r2[i].merchant_id != '1') {
                    r2[i].merchant_id = r2[i].merchant_id.toString().replace ? r2[i].merchant_id.toString().replace(/ /g, '') : r2[i].merchant_id;
                    let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${r2[i].merchant_id}`);
                    if (tyan[0])
                        yan = `&key=${tyan[0].yan}`;
                }
                let t = {
                    merId: r2[i].merchant_id,
                    orderId: r2[i].tid,
                    nonceStr: this.utils.randomString(16)
                };
                let sign = this.api.ascesign(t, yan);
                t['sign'] = sign;
                let qres = await this.api.payquery(t);
            }
        }
        let outtime = await this.utils.getsetcache('order_outtime', 60);
        let arr = [
            `SET @uids := null;`,
            `UPDATE top_order SET result = -1,err_info = '支付超时' WHERE is_delete = 0 AND  result = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) > ${outtime}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) ;`,
            `SELECT * FROM top_order WHERE id IN (@uids) ;`,
        ];
        let r = await this.sql.transaction(arr);
        if (r.result && r.data[0]) {
            let data = r.data;
            common_1.Logger.log(`有超时订单,数量:${data.length}`);
            let resetls = [];
            for (let i = 0; i < data.length; i++) {
                resetls.push(`'${data[i].oid}'`);
            }
            await this.sql.query(`UPDATE paylink SET  merchant_id = 0 ,result = 0,tid=NULL WHERE is_delete = 0 AND channel = 1 AND  oid in (${resetls.join(',')})`);
        }
        let pay_link_unlock_time = await this.utils.getsetcache('pay_link_unlock_time', 60);
        let arr3 = [
            `SET @uids := null;`,
            `UPDATE paylink SET merchant_id = 0 ,result = 0,tid=NULL WHERE is_delete = 0 AND  channel = 1 AND create_status = 1 AND  result = 2 AND unix_timestamp(NOW())-unix_timestamp(lock_time) > ${pay_link_unlock_time}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) ;`,
        ];
        await this.sql.transaction(arr3);
    }
    async resetZhquota_temp() {
        await this.sql.query(`UPDATE zh SET quota_temp = 0 `);
    }
    async handler_toporder() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let open = await this.utils.getsetcache('open', 60);
        if (Number(open) === 1 && this.utils.iscreate == false) {
            let r = await this.sql.query(`SELECT * FROM zhset WHERE mark LIKE '%面额%'`);
            let link_outtime = await this.utils.getsetcache('link_outtime', 60);
            await this.sql.query(`UPDATE paylink SET is_delete = 1 WHERE  result = 0 AND is_delete = 0 AND unix_timestamp(NOW())-unix_timestamp(create_time) > ${link_outtime};`);
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            for (let i = 0; i < r.length; i++) {
                let ak = await this.sql.query(`SELECT COUNT(*) AS count FROM paylink WHERE quota = ${Number(r[i].set_name) * 100} AND is_delete = 0 AND result = 0 AND zh is not null AND pay_link is not null AND channel = 1 AND    lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND create_status = 1`);
                if (ak[0].count < Number(r[i].set_value)) {
                    if (this.utils.nowprocess < this.utils.maxprocess) {
                        this.utils.iscreate = true;
                        let zhData = await this.sql.query(`select * FROM zh WHERE is_delete = 0 AND enable = 1 AND quota >=5000 AND quota-quota_temp >= 5000 AND balance_lock = 0 AND zh not in (SELECT zh FROM paylink WHERE channel = 1 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400) ORDER BY RAND() LIMIT 1`);
                        if (zhData[0]) {
                            let subprocess = this.top_ex.create(zhData[0], Number(r[i].set_name) * 100, 1, -1, true);
                            if (!subprocess) {
                                this.utils.iscreate = false;
                            }
                        }
                        else {
                            this.utils.iscreate = false;
                        }
                        break;
                    }
                    else {
                        this.utils.iscreate = false;
                    }
                }
            }
        }
        else {
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('* * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "vx_top_order_handler", null);
__decorate([
    (0, schedule_1.Cron)('* * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "sell_order_task", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handler_outtime", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "top_order_outtime_reset", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_5AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "resetZhquota_temp", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handler_toporder", null);
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, sell_EX_1.SellEXService, top_EX_1.TopEXService, zhexecute_service_1.ZhExecuteService, utils_service_1.UtilsService, redis_service_1.RedisService, api_service_1.ApiService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map