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
exports.ProxyUserService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const redis_service_1 = require("../utils/redis.service");
const utils_service_1 = require("../utils/utils.service");
let ProxyUserService = class ProxyUserService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async findAll(params, user) {
        this.LVERRORLOG(user);
        let { keyword, pageNum, pageSize } = params;
        let adminsql = this.isAdminSql(user);
        let uidsql = '';
        if (user.roles == 'proxyuser') {
            uidsql = ` AND pid = '${user.uid}'`;
        }
        let isdelsql = ` AND is_delete = 0`;
        let total = await this.sql.query(`SELECT count(1) AS count FROM adminuser WHERE (username LIKE '%${keyword ? keyword : ''}%' OR nickName LIKE '%${keyword ? keyword : ''}%')
      ${uidsql}
      ${isdelsql}
     ${adminsql}`);
        let r = await this.sql.query(`SELECT ${user.roles == 'admin' ? 'adminuser.*' : 'adminuser.uid, adminuser.username,adminuser.nickName,adminuser.uid,adminuser.quota,adminuser.up_open'}

      FROM adminuser
      WHERE (username LIKE '%${keyword ? keyword : ''}%'  OR nickName LIKE '%${keyword ? keyword : ''}%')
      ${uidsql}
      ${isdelsql}
      ${adminsql}
      
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        for (let i = 0; i < r.length; i++) {
            common_1.Logger.log(`SELECT SUM(quota) AS quota FROM top_order WHERE uid = '${r[i].uid}' AND result = 1 AND create_time >=  CURDATE() - INTERVAL 1 DAY AND create_time < CURDATE()`);
            let yestoday = await this.sql.query(`SELECT SUM(quota) AS quota FROM top_order WHERE uid = '${r[i].uid}' AND result = 1 AND create_time >=  CURDATE() - INTERVAL 1 DAY AND create_time < CURDATE()`);
            let today = await this.sql.query(`SELECT SUM(quota) AS quota FROM top_order WHERE uid = '${r[i].uid}' AND result = 1 AND top_order.create_time >= CURDATE() AND top_order.create_time < NOW()`);
            common_1.Logger.log(JSON.stringify(yestoday[0]));
            common_1.Logger.log(JSON.stringify(today[0]));
            r[i].yesterday_quota = yestoday[0].quota ? yestoday[0].quota : 0;
            r[i].today_quota = today[0].quota ? today[0].quota : 0;
        }
        return {
            total: total[0].count,
            quotatotal: total[0].quotatotal,
            list: r,
        };
    }
    async createuser(body, user) {
        common_1.Logger.log(` ${user.username}: ${user.uid} 创建 代理用户 ${body.username}`);
        this.LVERRORLOG(user);
        let r = await this.sql.query(`SELECT username FROM adminuser WHERE username = '${body.username}'`);
        if (r[0]) {
            throw new common_1.HttpException('用户名已存在', 400);
        }
        let userInfo = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${user.uid}'`);
        if (userInfo[0]) {
            userInfo = userInfo[0];
        }
        else {
            throw new common_1.HttpException('用户不存在', 400);
        }
        await this.sql.query(`INSERT INTO adminuser (note,status,loginTime,username,password,nickName,lv,roles,pid,uid,
      a_pid,a_pid_rate
      ${userInfo.lv >= 1 ? ',b_pid,b_pid_rate' : ''}
      ${userInfo.lv >= 2 ? ',c_pid,c_pid_rate' : ''}) 
    VALUES ('note',1,'${this.utils.dayjs().format("YYYY-MM-DD HH:mm:ss")}','${body.username}','${this.utils.md5(body.password)}','${body.nickName}',${user.lv + 1},'proxyuser','${user.uid}','${this.utils.uuid()}',
    '1',${userInfo.a_pid_rate}
    ${userInfo.lv == 1 ? `,'${userInfo.uid}',${userInfo.rate}` : userInfo.lv == 0 ? '' : `,'${userInfo.b_pid}',${userInfo.b_pid_rate}`}
    ${userInfo.lv == 2 ? `,'${userInfo.uid}',${userInfo.rate}` : ''}
    )`);
        return 'ok';
    }
    async updateuser(body, user) {
        common_1.Logger.log(body);
        this.LVERRORLOG(user);
        await this.isSelf(body, user);
        let { action } = body;
        let adminsql = this.isAdminSql(user);
        switch (action) {
            case 'topup':
                if (user.roles == 'proxy') {
                    let r = await this.sql.query(`SELECT quota FROM adminuser WHERE uid = '${user.uid}'`);
                    let deposit = await this.redis.get('deposit');
                    if (r[0] && deposit && r[0].quota - Number(deposit) < body.quota) {
                        throw new common_1.HttpException('额度不足', 400);
                    }
                    let r2 = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${body.uid}'`);
                    if (!r2[0]) {
                        throw new common_1.HttpException('充值用户不存在', 400);
                    }
                }
                let arr = [
                    `UPDATE adminuser SET quota = quota + ${body.quota} WHERE uid = '${body.uid}'`,
                ];
                user.roles != 'admin' ? arr.push(`UPDATE adminuser SET quota = quota - ${body.quota} WHERE uid = '${user.uid}'`) : '';
                arr.push(`INSERT INTO quotalog (actionuid,topuid,quota,action) VALUES ('${user.uid}','${body.uid}',${body.quota},'topup')`);
                await this.sql.transaction(arr);
                break;
            case 'resetpwd':
                await this.sql.query(`UPDATE adminuser SET password = '${this.utils.md5('123456')}' WHERE uid = '${body.uid}'${adminsql}`);
                break;
            case 'uprate':
                let rateArr = [
                    `UPDATE adminuser SET rate = ${body.rate} WHERE uid = '${user.uid}'${adminsql}`,
                ];
                if (user.uid == '1') {
                    rateArr.push(`UPDATE adminuser SET a_pid_rate = ${body.rate} WHERE a_pid = '${user.uid}'`);
                }
                else if (user.lv == 1) {
                    rateArr.push(`UPDATE adminuser SET b_pid_rate = ${body.rate} WHERE b_pid = '${user.uid}'`);
                }
                else if (user.lv == 2) {
                    rateArr.push(`UPDATE adminuser SET c_pid_rate = ${body.rate} WHERE c_pid = '${user.uid}'`);
                }
                await this.sql.transaction(rateArr);
                break;
            case "commission":
                let { commission } = body;
                commission = Math.floor(commission * 100);
                let r = await this.sql.query(`SELECT commission FROM adminuser WHERE uid = '${user.uid}'`);
                if (r[0] && r[0].commission < commission) {
                    common_1.Logger.error(`提余失败 ${user.username}|${user.uid}|${commission}`);
                    throw new common_1.HttpException('佣金不足', 400);
                }
                let commissionarr = [
                    `UPDATE adminuser SET quota = quota + ${commission},commission = commission - ${commission} WHERE uid = '${user.uid}' AND commission >= ${commission} ${adminsql}`,
                    `INSERT INTO quotalog (actionuid,topuid,quota,action) VALUES ('${user.uid}','${user.uid}',${commission},'commission')`
                ];
                await this.sql.transaction(commissionarr);
                break;
            case 'payopen':
                let { value } = body;
                await this.sql.query(`UPDATE adminuser SET pay_open = ${value} WHERE uid = '${user.uid}'${adminsql}`);
                break;
            case 'upopen':
                let { upopen, uid } = body;
                if (user.roles != 'admin') {
                    let upuser = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${uid}' AND pid = '${user.uid}'`);
                    if (!upuser[0]) {
                        throw new common_1.HttpException('无权操作', 400);
                    }
                }
                await this.sql.query(`UPDATE adminuser SET up_open = ${upopen} WHERE uid = '${uid}'  ${adminsql}`);
                break;
        }
        return 'ok';
    }
    async deleteuser(body, user) {
        common_1.Logger.log(` ${user.username} 删除 代理用户 ${body.uid}`);
        this.LVERRORLOG(user);
        await this.isSelf(body, user);
        let { uid } = body;
        let adminsql = this.isAdminSql(user);
        let arr = [];
        if (user.roles == 'admin') {
            arr = [`DELETE FROM adminuser WHERE uid = '${uid}' AND username != 'admin'`,
                `DELETE FROM adminuser WHERE pid = '${uid}' AND username != 'admin'`];
        }
        else {
            arr = [`UPDATE adminuser SET is_delete = 1 WHERE uid = '${uid}'${adminsql}`,
                `UPDATE adminuser SET is_delete = 1 WHERE pid = '${uid}'${adminsql}`];
        }
        await this.sql.transaction(arr);
        return 'ok';
    }
    LVERRORLOG(user) {
        if (user.lv > 2) {
            common_1.Logger.error(` ${user.username} 执行 非法操作 lv:${user.lv} `);
            throw new common_1.HttpException('权限不足', 400);
        }
    }
    async isSelf(body, user) {
        if (body.action == 'uprate' || body.action == 'commission' || body.action == "payopen")
            return;
        let r = await this.sql.query(`SELECT pid FROM adminuser WHERE uid = '${body.uid}'`);
        if (r[0].pid != user.uid && user.roles != 'admin') {
            common_1.Logger.error(` ${user.username} 执行 非法操作 uid:${body.uid} `);
            throw new common_1.HttpException('请求失败', 400);
        }
        if (body.uid == user.uid && user.roles != 'admin' && body.action != 'updatepwd') {
            throw new common_1.HttpException('请求失败', 400);
        }
    }
    isAdminSql(user) {
        if (user.roles == 'admin')
            return '';
        return ` AND username != 'admin'`;
    }
};
ProxyUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        utils_service_1.UtilsService,
        redis_service_1.RedisService])
], ProxyUserService);
exports.ProxyUserService = ProxyUserService;
//# sourceMappingURL=proxyuser.service.js.map