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
exports.TopOrderService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const utils_service_1 = require("../utils/utils.service");
const api_service_1 = require("../api/api.service");
let TopOrderService = class TopOrderService {
    constructor(sql, zhEX, utils, api) {
        this.sql = sql;
        this.zhEX = zhEX;
        this.utils = utils;
        this.api = api;
        this.order_talbe = 'top_order';
        this.NOZH = -1;
        this.linktype = {
            1: 'QQ'
        };
    }
    async create(body, user) {
        let arr = [
            `SET @uids := null;`,
            `UPDATE zh SET quota_temp = quota_temp + ${body.quota}  WHERE enable = 1 AND is_delete = 0 AND quota - quota_temp > ${body.quota}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
            `SELECT * FROM zh WHERE id IN (@uids) ;`,
        ];
        let zh = await this.sql.transaction(arr);
        let failsql = ``;
        let code = 0;
        if (zh.result && zh.data[0]) {
            let zhData = zh.data[0];
            failsql = `UPDATE zh SET quota_temp = quota_temp - ${body.quota} WHERE id = ${zhData.id}`;
            console.log(zhData);
        }
        else {
            code = this.NOZH;
        }
        return { code };
    }
    async findAll(params, user) {
        let { uid, zid, keyword, pageNum, pageSize, queryType, zhmark, dateArray, channel, merchant_id, channelsub } = params;
        let uidsql = '';
        if (user.roles == 'admin' && uid) {
            uidsql = ` AND uid = '${uid}'`;
        }
        let channelsubsql = '';
        if (channelsub) {
            channelsubsql = ` AND zhmark = '${channelsub}'`;
        }
        let zidsql = '';
        if (zid) {
            zidsql = ` AND (zid LIKE '%${zid}%' or zh LIKE '%${zid}%')`;
        }
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let zhmarksql = '';
        if (zhmark) {
            zhmarksql = ` AND zhmark LIKE '%${zhmarksql}%'`;
        }
        let channelsql = '';
        if (channel) {
            channelsql = ` AND channel = ${channel}`;
        }
        let merchantidsql = '';
        if (merchant_id && typeof merchant_id == 'number') {
            merchantidsql = ` AND merchant_id = ${merchant_id}`;
        }
        let createsql = '';
        if (dateArray) {
            dateArray = dateArray.split(',');
            createsql = ` AND unix_timestamp(create_time) > unix_timestamp('${this.utils.dayjsDate(dateArray[0]).format('YYYY-MM-DD HH:mm:ss')}') AND unix_timestamp(create_time) <= unix_timestamp('${this.utils.dayjsDate(dateArray[1]).format('YYYY-MM-DD HH:mm:ss')}')`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count,SUM(quota) AS quotatotal FROM ${this.order_talbe} WHERE is_delete = 0 
      ${zidsql} ${queryTypesql} ${zhmarksql} ${createsql} ${channelsql} ${merchantidsql} ${uidsql} ${channelsubsql}
      ${this.isAdmin(user)};
      `);
        let r = await this.sql.query(`SELECT * FROM ${this.order_talbe} WHERE 
      is_delete = 0 
      AND (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%' or mer_orderId LIKE '%${keyword ? keyword : ''}%')
      ${zidsql}
      ${queryTypesql}
      ${zhmarksql}
      ${createsql}
      ${channelsql}
      ${channelsubsql}
      ${merchantidsql}
      ${uidsql}
      ${this.isAdmin(user)}
       ORDER BY create_time DESC
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            quotatotal: total[0].quotatotal ? total[0].quotatotal : 0,
            list: r,
        };
    }
    async getlink(query, user) {
        let q = Number(query.quota) * 100;
        if (q != 5000 && q != 10000 && q != 20000) {
            return { code: -2, msg: "???????????????,???????????????50 100 200" };
        }
        let arr = [
            `SET @uids := null;`,
            `UPDATE paylink SET  result = 2,merchant_id = ${user.uid},lock_time =  date_format(now() + 900,'%Y-%m-%d %H:%i:%s')  WHERE  merchant_id=0 AND pay_link is not null  AND  quota = ${Number(query.quota) * 100} AND result = 0 AND is_delete = 0 AND lock_time <= now()  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
            `SELECT * FROM paylink WHERE id IN (@uids) ;`,
        ];
        common_1.Logger.log(arr);
        let r = await this.sql.transaction(arr);
        if (r.result && r.data[0]) {
            let { zh, pay_link, link_type, oid } = r.data[0];
            let uid = this.utils.guid('q', query.quota);
            common_1.Logger.log(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid) VALUES ('${uid}','${zh}',${q},${user.uid},'${pay_link}',2,'${oid}')`);
            await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid) VALUES ('${uid}','${zh}',${q},${user.uid},'${pay_link}',2,'${oid}')`);
            return { code: 1, pay_link, tid: uid };
        }
        else {
            return { code: -1, msg: "???????????????" };
        }
    }
    async checkorder(query, user) {
        let { tid, merchant_id } = query;
        if (!query.tid) {
            new common_1.HttpException('?????????????????????', 400);
        }
        let r = await this.isSelf(query, user);
        let meridsql = '';
        if (user.roles != 'admin') {
            meridsql = ` AND merchant_id = ${merchant_id}`;
        }
        let yan = '', merId;
        if (r[0].merchant_id != '1') {
            merId = r[0].merchant_id;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        if (query.action == '2') {
            let arr = [
                `UPDATE paylink SET result = -1, create_status = -1 WHERE oid = '${r[0].oid}' ${this.isAdmin(user)}`,
                `UPDATE top_order SET result = 1,err_info='????????????' WHERE tid = '${r[0].tid}' AND uid = '${r[0].uid}'`
            ];
            if (r[0].err_info == "????????????") {
                arr.push(`UPDATE adminuser SET quota = quota - ${r[0].quota} WHERE uid = '${r[0].uid}'`);
                arr.push(`INSERT INTO quotalog(action,actionuid,topuid,quota) VALUES('conpay','${r[0].uid}','0',${r[0].quota});`);
                arr.push(`UPDATE zh SET quota_temp = quota_temp + ${r[0].quota} WHERE zid = '${r[0].zid}'`);
            }
            else {
                throw new common_1.HttpException('??????????????????????????????', 400);
            }
            let tNotify = {
                merId: r[0].merchant_id,
                orderId: r[0].mer_orderId,
                sysOrderId: r[0].tid,
                desc: 'no',
                orderAmt: (r[0].quota / 100).toString(),
                status: '1',
                nonceStr: this.utils.randomString(16),
                attch: '1'
            };
            await this.api.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
            let agent = await this.sql.query(`SELECT * FROM adminuser WHERE uid = '${r[0].uid}'`);
            if (agent[0]) {
                agent = agent[0];
                if (agent.a_pid) {
                    arr.push(`UPDATE adminuser SET commission = commission + ${r[0].quota * Math.floor(agent.a_pid_rate / 1000 * 1000) / 1000} WHERE uid = '${agent.a_pid}'`);
                    arr.push(`INSERT INTO commissionlog (uid,tid,quota,rate,channel) VALUES ('${agent.a_pid}','${r[0].tid}',${r[0].quota * Math.floor(agent.a_pid_rate / 1000 * 1000) / 1000},${agent.a_pid_rate},${r[0].channel})`);
                }
                if (agent.b_pid) {
                    arr.push(`UPDATE adminuser SET commission = commission + ${r[0].quota * Math.floor(agent.b_pid_rate / 1000 * 1000) / 1000} WHERE uid = '${agent.b_pid}'`);
                    arr.push(`INSERT INTO commissionlog (uid,tid,quota,rate,channel) VALUES ('${agent.b_pid}','${r[0].tid}',${r[0].quota * Math.floor(agent.b_pid_rate / 1000 * 1000) / 1000},${agent.b_pid_rate},${r[0].channel})`);
                }
                if (agent.c_pid) {
                    arr.push(`UPDATE adminuser SET commission = commission + ${r[0].quota * Math.floor(agent.c_pid_rate / 1000 * 1000) / 1000} WHERE uid = '${agent.c_pid}'`);
                    arr.push(`INSERT INTO commissionlog (uid,tid,quota,rate,channel) VALUES ('${agent.c_pid}','${r[0].tid}',${r[0].quota * Math.floor(agent.c_pid_rate / 1000 * 1000) / 1000},${agent.c_pid_rate},${r[0].channel})`);
                }
            }
            await this.sql.transaction(arr);
            return 'ok';
        }
        else {
            if (r[0].result == 1) {
                return { code: 1, msg: "????????????" };
            }
        }
        let zh = await this.sql.query(`SELECT * FROM zh WHERE zh = '${r[0].zh}'`);
        if (zh[0]) {
            let openidArray = zh[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/);
            let openid = openidArray.length > 1 ? openidArray[1] : common_1.Logger.error("?????????????????????openid");
            let openkeyArray = zh[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/);
            let openkey = openkeyArray.length > 1 ? openkeyArray[1] : common_1.Logger.error("?????????????????????openkey");
            let translist = await this.zhEX.checktranslist(openid, openkey, r[0].zh);
            this.utils.istestlog('top_order');
            this.utils.istestlog(translist);
            if (translist && translist.indexOf(r[0].oid) > -1) {
                let arr = [
                    `UPDATE top_order SET result = 1,err_info='????????????' WHERE tid = '${query.tid}' ${this.isAdmin(user)}`,
                    `UPDATE paylink AS a JOIN (SELECT top_order.oid FROM top_order WHERE tid = '${query.tid}' ${this.isAdmin(user)} )b ON a.oid = b.oid  SET result = 1,tid = '${query.tid}'  `
                ];
                await this.sql.transaction(arr);
                let ispay = 1;
                let tNotify = {
                    merId: r[0].merchant_id,
                    orderId: r[0].mer_orderId,
                    sysOrderId: r[0].tid,
                    desc: 'no',
                    orderAmt: (r[0].quota / 100).toString(),
                    status: ispay.toString(),
                    nonceStr: this.utils.randomString(16),
                    attch: '1'
                };
                this.api.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
                return { code: 1, msg: "????????????,?????????????????????" };
            }
            return { code: 0, msg: "????????????" };
        }
        return { code: -1, msg: "???????????????" };
    }
    async deleteOrder(body, user) {
        common_1.Logger.log(body);
        let { tid, list } = body;
        if (tid) {
            if (user.roles != 'admin') {
                await this.sql.query(`UPDATE top_order SET is_delete = 1 WHERE tid = '${body.tid}' ${this.isAdmin(user)}`);
            }
            else if (user.roles == 'admin') {
                await this.sql.query(`DELETE FROM top_order WHERE tid = '${body.tid}'`);
            }
        }
        else if (list) {
            list = list.split(',');
            if (user.roles != 'admin') {
                await this.sql.query(`UPDATE top_order SET is_delete = 1 WHERE tid in ('${list.join("','")}') ${this.isAdmin(user)}`);
            }
            else if (user.roles == 'admin') {
                await this.sql.query(`DELETE FROM top_order WHERE tid in  ('${list.join("','")}')`);
            }
        }
        return 'ok';
    }
    isAdmin(user) {
        if (user.roles == 'admin')
            return '';
        return ` AND uid = '${user.uid}'`;
    }
    async isSelf(query, user) {
        let r = await this.sql.query(`SELECT * FROM top_order WHERE tid = '${query.tid}' ${this.isAdmin(user)}`);
        if (r[0]) {
            if (r[0].uid == user.uid)
                return r;
            if (user.roles == 'admin')
                return r;
            throw new common_1.HttpException('?????????', 400);
        }
        else {
            throw new common_1.HttpException('???????????????', 400);
        }
    }
};
TopOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, zhexecute_service_1.ZhExecuteService, utils_service_1.UtilsService, api_service_1.ApiService])
], TopOrderService);
exports.TopOrderService = TopOrderService;
//# sourceMappingURL=top_order.service.js.map