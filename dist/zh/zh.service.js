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
exports.ZhService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const path_1 = require("path");
const fsp = require("fs/promises");
const zhexecute_service_1 = require("./zhexecute.service");
const utils_service_1 = require("../utils/utils.service");
const sell_EX_1 = require("../sell_order/sell_EX");
var { escape } = require('mysql');
const TEMPPATH = require('../../config.json').tempPath;
let ZhService = class ZhService {
    constructor(sql, ex, utils, sell_EX) {
        this.sql = sql;
        this.ex = ex;
        this.utils = utils;
        this.sell_EX = sell_EX;
        this.zh_table = "zh";
    }
    async create(body, user) {
        common_1.Logger.log(TEMPPATH);
        let fp = (0, path_1.join)(TEMPPATH, body.filenamelist[0].filename);
        let fd = await fsp.readFile(fp);
        let cookieArray = fd.toString().split('\r\n');
        let i = 0;
        let datasql = [], error = [];
        cookieArray.forEach(e => {
            i++;
            let zh = e.split('----');
            if (zh && zh[1]) {
                let zuid = this.utils.zhguid();
                zh[0] = this.clearData(zh[0]);
                zh[1] = this.clearData(zh[1]);
                datasql.push(`('${zh[0]}','${zh[1]}','${zuid}','${user.uid}')`);
            }
            else {
                error.push(i);
            }
        });
        await this.sql.query(`INSERT ignore INTO ${this.zh_table}(zh,cookie,zid,uid) VALUE ${datasql.join(',')}`);
        return error.length > 0 ? error : 'ok';
    }
    async findAll(params, user) {
        console.log("params", params);
        let link_outtime = await this.utils.getsetcache('link_outtime', 120);
        let { channelsub } = params;
        let channelsubsql = channelsub ? ` AND mark = '${channelsub == '未设置' ? '' : channelsub}'` : '';
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.zh_table} WHERE (zh LIKE '%${params.keyword ? params.keyword : ''}%' or zid LIKE '%${params.keyword ? params.keyword : ''}%') AND is_delete = 0 
      ${channelsubsql}
      ${this.isAdmin(user)}
      `);
        let r = await this.sql.query(`SELECT zh.*,adminuser.username,
SUM(DISTINCT CASE WHEN top_order.create_time >= CURDATE() AND top_order.create_time < NOW() AND top_order.result = 1 THEN top_order.totalquota ELSE 0 END) AS today_quota,
SUM( DISTINCT CASE WHEN top_order.create_time >= CURDATE() - INTERVAL 1 DAY AND top_order.create_time < CURDATE() AND top_order.result = 1 THEN top_order.totalquota ELSE 0 END) AS yesterday_quota,
paylink.link_count AS link_count,
SUM(DISTINCT CASE WHEN paylink.is_delete = 0 AND paylink.create_status = 1 THEN paylink.totalquota ELSE 0 END) AS link_total_quota
FROM zh
LEFT JOIN (
SELECT zh, create_time,result,sum(quota) AS totalquota
FROM top_order
WHERE result = 1
GROUP by zh
)top_order ON zh.zh = top_order.zh
LEFT JOIN (
SELECT zh, SUM(quota) AS totalquota,is_delete,create_status,result,id,COUNT(id) AS link_count
FROM paylink
WHERE is_delete = 0 AND create_status = 1  AND paylink.create_time > FROM_UNIXTIME(unix_timestamp(now()) - ${link_outtime})
GROUP by zh
)paylink ON zh.zh = paylink.zh
LEFT JOIN (
select uid,username from adminuser
)adminuser ON zh.uid = adminuser.uid
WHERE 
(zh.zh LIKE '%${params.keyword ? params.keyword : ''}%' or zh.zid LIKE '%${params.keyword ? params.keyword : ''}%') AND zh.is_delete = 0  ${channelsubsql}
${user.roles != 'admin' ? ` AND zh.uid = '${user.uid}'` : ''}
GROUP BY zh.zh
LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}
;`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async up(body, user) {
        if (body.list) {
            body.list = body.list.split(',');
        }
        await this.isSelf(body, user);
        let whosql = ``;
        if (body.list) {
            whosql = `zid in ('${body.list.join("','")}')`;
        }
        else {
            whosql = `zid = '${body.zid}'`;
        }
        if (body.action == 'del') {
            await this.sql.query(`DELETE FROM ${this.zh_table} WHERE  ${whosql}`);
        }
        else if (body.action == 'quota') {
            await this.sql.query(`UPDATE ${this.zh_table} SET quota = ${body.quota} WHERE  ${whosql}`);
        }
        else if (body.action == 'mark') {
            await this.sql.query(`UPDATE ${this.zh_table} SET mark = '${body.mark}' WHERE  ${whosql}`);
        }
        else if (body.action == 'enable') {
            await this.sql.query(`UPDATE ${this.zh_table} SET enable = ${body.enable} WHERE zid = '${body.zid}'`);
        }
        else if (body.action == 'cookie') {
            await this.sql.query(`UPDATE ${this.zh_table} SET cookie = '${body.cookie}' WHERE zid = '${body.zid}'`);
        }
        else if (body.action == 'upquotaall') {
            await this.ex.upquota('all', body, user);
        }
        else if (body.action == 'upquota') {
            await this.ex.upquota('upquota', body, user);
        }
        else if (body.action == 'upmark') {
            await this.sql.query(`UPDATE ${this.zh_table} SET mark = '${body.mark}' WHERE zid = '${body.zid}'`);
        }
        return 'ok';
    }
    async checkzh() {
        return;
        this.checkzhScript();
        return 'ok';
    }
    async checkzhScript() {
        let zh = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE is_delete = 0 `);
        for (let i = 0; i < zh.length; i++) {
            await this.sell_EX.createProm({
                top_zh: '1403984237',
                game_type: 'DNF',
                game_qu: '1',
                quota: 1,
                merchant_id: 999,
                sellid: 999999
            }, zh[i]);
        }
    }
    async gettask(query) {
        if (query.action == 'get') {
            let arr = [
                `SET @uids := null;`,
                `UPDATE task SET status =2 , device_id = '${query.device_id}' ${query.nick_name ? `,nick_name ='${query.nick_name}'` : ''}  WHERE isNull(device_id)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM task WHERE id IN (@uids) ;`,
            ];
            let zh = await this.sql.transaction(arr);
            return zh.data[0] ? zh.data[0] : 'no';
        }
        else if (query.action = 'check') {
            let s = await this.sql.query(`SELECT * FROM task WHERE id = ${query.id}`);
            return s[0] ? s[0] : { status: 2 };
        }
    }
    async checktask(query) {
        if (query.action == 'outtime') {
            await this.sql.query(`UPDATE task SET status = -2 WHERE id = ${query.id}`);
            return 'ok';
        }
        else if (query.action == 'check') {
            let s = await this.sql.query(`SELECT status FROM task WHERE id = ${query.id}`);
            return s[0];
        }
    }
    async upaqcode(query) {
        common_1.Logger.log(`${query.zh} aq_code:${query.code}`);
        await this.sql.query(`UPDATE zh SET aq_code = '${query.code}',aq_code_is_use = 0,aq_code_last_up_time	=now() WHERE zh = '${query.zh}'`);
        return 'ok';
    }
    isAdmin(user) {
        if (user.roles == 'admin')
            return '';
        return ` AND uid = '${user.uid}'`;
    }
    async isSelf(body, user) {
        let r = [];
        if (body.list) {
            r = await this.sql.query(`SELECT uid FROM zh WHERE zid in ('${body.list.join("','")}')`);
            if (!r[0])
                return;
            for (let i = 0; i < r.length; i++) {
                if (r[i].uid != user.uid && user.roles != 'admin') {
                    common_1.Logger.error(` ${user.username} 执行 非法操作 zid:${body.list.join(',')} `);
                    throw new common_1.HttpException('请求失败', 400);
                }
            }
        }
        else {
            r = await this.sql.query(`SELECT uid FROM zh WHERE zid = '${body.zid}'`);
            if (r[0] && r[0].uid != user.uid && user.roles != 'admin') {
                common_1.Logger.error(` ${user.username} 执行 非法操作 zid:${body.zid} `);
                throw new common_1.HttpException('请求失败', 400);
            }
        }
    }
    clearData(data) {
        data = data.toString().replace(/\s+/g, '');
        let num = Number(data);
        if (isNaN(num)) {
            data = escape(data);
            data = data.toString().replace(/'/g, '');
            data = data.toString().replace(/--|select|update|delete|insert|from/g, '');
        }
        return data;
    }
};
ZhService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, zhexecute_service_1.ZhExecuteService, utils_service_1.UtilsService, sell_EX_1.SellEXService])
], ZhService);
exports.ZhService = ZhService;
//# sourceMappingURL=zh.service.js.map