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
exports.SellEXService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const redis_service_1 = require("../utils/redis.service");
const utils_service_1 = require("../utils/utils.service");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const { spawn } = require("child_process");
const { scriptPath } = require('../../config.json');
let SellEXService = class SellEXService {
    constructor(sql, utils, zhEX, redis) {
        this.sql = sql;
        this.utils = utils;
        this.zhEX = zhEX;
        this.redis = redis;
        this.sell_order = 'sell_order';
        this.NOZH = -1;
        this.processLs = {};
    }
    async create(body, zh) {
        this.utils.nowprocess++;
        let args = [scriptPath,
            zh.zh,
            zh.cookie,
            `pay`,
            body.game_type,
            body.top_zh,
            body.quota,
            body.sellid,
            body.game_qu
        ];
        let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
        if (subchild) {
            this.processLs[zh.zh] = subchild;
            subchild.on("message", async (msg) => {
                console.log('监听子进程信息', msg);
                switch (msg.action) {
                    case 'busy':
                        await this.sql.query(` UPDATE zh SET lock_time =FROM_UNIXTIME( unix_timestamp(lock_time)+3600 ) WHERE   zh = '${msg.zh}'`);
                        await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 1 WHERE zh = '${msg.zh}'`);
                        await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='安全码繁忙' WHERE id =${msg.sellid}`);
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (this.killprocess(msg.zh)) {
                            this.utils.nowprocess--;
                            common_1.Logger.log('sell_EX =>' + `kill process success,AQ_code is busy , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case 'code':
                        let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                        if (c[0] && c[0].aq_code) {
                            await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                            subchild.send({ action: 'code', code: c[0].aq_code });
                        }
                        break;
                    case 'upcode':
                        let res = await this.sql.query(`INSERT INTO task(zh,up_time) VALUES('${msg.zh}',now())`);
                        common_1.Logger.log('sell_EX =>' + 'create aq_code task ,id:' + res.insertId);
                        subchild.send({ action: 'taskid', taskid: res.insertId });
                        break;
                    case 'pay':
                        common_1.Logger.log('sell_EX =>' + JSON.stringify(msg));
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (msg.result == '成功') {
                            common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} success `);
                            await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime `);
                            await this.zhEX.upbyzh(msg.zh);
                            let nowquota = await this.sql.query(`SELECT balance FROM zh WHERE zh = '${msg.zh}'`);
                            let order_before_quota = await this.sql.query(`SELECT before_quota FROM sell_order WHERE id = ${msg.sellid}`);
                            if (nowquota[0].balance != order_before_quota[0].before_quota) {
                                common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime but success `);
                                await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='回调超时' WHERE id =${msg.sellid}`);
                            }
                        }
                        else {
                            await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} ,balance_lock = 0 WHERE zh = '${msg.zh}'`);
                        }
                        if (this.killprocess(msg.zh)) {
                            this.utils.nowprocess--;
                            common_1.Logger.log('sell_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case "check":
                        if (msg.result == '成功') {
                            await this.sql.query(`UPDATE zh SET enable = 1 WHERE zh = '${msg.zh}'`);
                        }
                        else {
                            await this.sql.query(`UPDATE zh SET enable = 0 WHERE zh = '${msg.zh}'`);
                        }
                        break;
                    default:
                        break;
                }
            });
            subchild.stdout.on("data", async (data) => {
                let islog = await this.utils.getsetcache('scriptlog', 60);
                if (islog == '1')
                    common_1.Logger.log('sell_EX =>' + data.toString());
            });
            subchild.stderr.on("data", (data) => {
                data = data.toString();
                common_1.Logger.error("error" + data);
            });
            subchild.on("exit", (code, signal) => {
                common_1.Logger.error('sell_EX =>' + `exit process -${code} - ${signal}`);
            });
            return subchild;
        }
        else {
            this.utils.nowprocess--;
        }
        return false;
    }
    async createProm(body, zh) {
        return await new Promise(async (resolve, reject) => {
            this.utils.nowprocess++;
            let args = [scriptPath,
                zh.zh,
                zh.cookie,
                `pay`,
                body.game_type,
                body.top_zh,
                body.quota,
                body.sellid,
                body.game_qu
            ];
            let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
            if (subchild) {
                this.processLs[zh.zh] = subchild;
                subchild.on("message", async (msg) => {
                    console.log('监听子进程信息', msg);
                    switch (msg.action) {
                        case 'busy':
                            await this.sql.query(` UPDATE zh SET lock_time =FROM_UNIXTIME( unix_timestamp(lock_time)+3600 ) WHERE   zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 1 WHERE zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='安全码繁忙' WHERE id =${msg.sellid}`);
                            await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                            if (this.killprocess(msg.zh)) {
                                this.utils.nowprocess--;
                                common_1.Logger.log('sell_EX =>' + `kill process success,AQ_code is busy , nowprocess-- ${this.utils.nowprocess}`);
                            }
                            break;
                        case 'code':
                            let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                            if (c[0] && c[0].aq_code) {
                                await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                                subchild.send({ action: 'code', code: c[0].aq_code });
                            }
                            break;
                        case 'upcode':
                            let res = await this.sql.query(`INSERT INTO task(zh,up_time) VALUES('${msg.zh}',now())`);
                            common_1.Logger.log('sell_EX =>' + 'create aq_code task ,id:' + res.insertId);
                            subchild.send({ action: 'taskid', taskid: res.insertId });
                            break;
                        case 'pay':
                            common_1.Logger.log('sell_EX =>' + JSON.stringify(msg));
                            await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                            if (msg.result == '成功') {
                                common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} success `);
                                await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                            }
                            else if (msg.result == '超时') {
                                common_1.Logger.error(`${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime `);
                                await this.zhEX.upbyzh(msg.zh);
                                let nowquota = await this.sql.query(`SELECT balance FROM zh WHERE zh = '${msg.zh}'`);
                                let order_before_quota = await this.sql.query(`SELECT before_quota FROM sell_order WHERE id = ${msg.sellid}`);
                                if (nowquota[0].balance != order_before_quota[0].before_quota) {
                                    common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime but success `);
                                    await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                    await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                                }
                                else {
                                    await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                    await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='回调超时' WHERE id =${msg.sellid}`);
                                }
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} ,balance_lock = 0 WHERE zh = '${msg.zh}'`);
                            }
                            if (this.killprocess(msg.zh)) {
                                this.utils.nowprocess--;
                                common_1.Logger.log('sell_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                            }
                            break;
                        case "check":
                            if (msg.result == '成功') {
                                await this.sql.query(`UPDATE zh SET enable = 1 WHERE zh = '${msg.zh}'`);
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET enable = 0 WHERE zh = '${msg.zh}'`);
                            }
                            resolve(msg);
                            break;
                        default:
                            break;
                    }
                });
                subchild.stdout.on("data", async (data) => {
                    let islog = await this.utils.getsetcache('scriptlog', 60);
                    if (islog == '1')
                        common_1.Logger.log('sell_EX =>' + data.toString());
                });
                subchild.stderr.on("data", (data) => {
                    data = data.toString();
                    common_1.Logger.error("error" + data);
                });
                subchild.on("exit", (code, signal) => {
                    common_1.Logger.error('sell_EX =>' + `exit process -${code} - ${signal}`);
                });
            }
            else {
                this.utils.nowprocess--;
            }
        });
    }
    killprocess(zh) {
        if (this.processLs[zh]) {
            return this.processLs[zh].kill(2);
        }
        else {
            return false;
        }
    }
};
SellEXService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, utils_service_1.UtilsService, zhexecute_service_1.ZhExecuteService, redis_service_1.RedisService])
], SellEXService);
exports.SellEXService = SellEXService;
//# sourceMappingURL=sell_EX.js.map