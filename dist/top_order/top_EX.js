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
exports.TopEXService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const redis_service_1 = require("../utils/redis.service");
const utils_service_1 = require("../utils/utils.service");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const { spawn } = require("child_process");
const { scriptPath } = require('../../config.json');
const REQ = require('request-promise-native');
let TopEXService = class TopEXService {
    constructor(sql, utils, zhEX, redis) {
        this.sql = sql;
        this.utils = utils;
        this.zhEX = zhEX;
        this.redis = redis;
        this.sell_order = 'sell_order';
        this.top_order = 'top_order';
        this.NOZH = -1;
        this.processLs = {};
    }
    async create(zh, quota, channel, topid, isautocreate = false) {
        this.utils.nowprocess++;
        let args = [scriptPath,
            zh.zh,
            zh.cookie,
            `top`,
            quota / 100,
            channel,
            zh.zid,
            topid
        ];
        let isproxy = await this.utils.getsetcache('isproxy', 60);
        if (isproxy == '1') {
            let getproxyurl = await this.utils.getsetcachemark('isproxy', 60);
            try {
                let res = await REQ.get(getproxyurl);
                if (res && res.indexOf(":") != -1) {
                    common_1.Logger.log(`代理ip ${res}`);
                    let r = await REQ.get('http://www.baidu.com', { proxy: `http://${res}`, timeout: 3000 });
                    let proxyArray = res.split(":");
                    args.push(proxyArray[0]);
                    args.push(proxyArray[1]);
                }
                else {
                    common_1.Logger.error("获取代理失败");
                    if (isautocreate) {
                        this.utils.iscreate = false;
                    }
                    this.utils.nowprocess--;
                    return false;
                }
            }
            catch (error) {
                common_1.Logger.error("代理失败", error);
                if (isautocreate) {
                    this.utils.iscreate = false;
                }
                this.utils.nowprocess--;
                return false;
            }
        }
        common_1.Logger.log('top_EX =>' + `node ${args.join(' ')}`);
        let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
        if (subchild) {
            this.processLs[zh.zh] = subchild;
            subchild.on("message", async (msg) => {
                console.log('监听子进程信息', msg);
                switch (msg.action) {
                    case 'code':
                        let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                        if (c[0] && c[0].aq_code) {
                            await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                            subchild.send({ action: 'code', code: c[0].aq_code });
                        }
                        break;
                    case 'upcode':
                        let res = await this.sql.query(`INSERT INTO task(zh) VALUES('${msg.zh}')`);
                        common_1.Logger.log('top_EX =>' + 'create aq_code task ,id:' + res.insertId);
                        subchild.send({ action: 'taskid', taskid: res.insertId });
                        break;
                    case 'top':
                        common_1.Logger.log('top_EX =>' + JSON.stringify(msg));
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (msg.result == '成功') {
                            common_1.Logger.log('top_EX =>' + `${msg.zh} create top_link success `);
                            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,lock_time) VALUES ('${msg.zh}',${Number(msg.quota) * 100},'${msg.pay_link}',0,now(),1,'${msg.oid}','${msg.zid}',FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}))`);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`'top_EX =>' + ${msg.zh} create ${msg.quota} top_link  outtime `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}')`);
                        }
                        else if (msg.result == '风险验证') {
                            common_1.Logger.error(`'top_EX =>' + ${msg.zh} create ${msg.quota} top_link  verifycode `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}')`);
                        }
                        if (this.killprocess(msg.zh)) {
                            if (isautocreate) {
                                this.utils.iscreate = false;
                            }
                            this.utils.nowprocess--;
                            common_1.Logger.log('top_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case 'topVX':
                        common_1.Logger.log('top_EX topVX =>  ' + JSON.stringify(msg));
                        if (msg.result == '成功') {
                            common_1.Logger.log('top_EX topVX =>' + `${msg.zh} create topVX_link success `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,channel) VALUES ('${msg.zh}',${Number(msg.quota) * 100},'${msg.pay_link}',0,now(),1,'${msg.oid}','${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET zh = '${msg.zh}',pay_link = '${msg.pay_link}',oid = '${msg.oid}',zid = '${msg.zid}',create_status = 1 WHERE tid = '${msg.topid}'`);
                            this.redis.set(msg.topid, msg.pay_link, 90);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`'top_EX topVX=>' + ${msg.zh} create ${msg.quota} topVX_link  outtime `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid,channel) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET create_status = 0 WHERE tid = '${msg.topid}'`);
                        }
                        else if (msg.result == '风险验证') {
                            common_1.Logger.error(`'top_EX topVX=>' + ${msg.zh} create ${msg.quota} topVX_link  verifycode `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid,channel) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET create_status = 0 WHERE tid = '${msg.topid}'`);
                        }
                        if (this.killprocess(msg.zh)) {
                            if (isautocreate) {
                                this.utils.iscreate = false;
                            }
                            this.utils.nowprocess--;
                            common_1.Logger.log('top_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    default:
                        break;
                }
            });
            subchild.stdout.on("data", async (data) => {
                let islog = await this.utils.getsetcache('scriptlog', 60);
                if (islog == '1')
                    common_1.Logger.log('top_EX =>' + data.toString());
            });
            subchild.stderr.on("data", (data) => {
                data = data.toString();
                common_1.Logger.error("error" + data);
            });
            subchild.on("exit", (code, signal) => {
                common_1.Logger.error('top_EX =>' + `exit process -${code} - ${signal}`);
            });
            return subchild;
        }
        else {
            this.utils.nowprocess--;
        }
        return false;
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
TopEXService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, utils_service_1.UtilsService, zhexecute_service_1.ZhExecuteService, redis_service_1.RedisService])
], TopEXService);
exports.TopEXService = TopEXService;
//# sourceMappingURL=top_EX.js.map