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
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const top_EX_1 = require("../top_order/top_EX");
const mysql_service_1 = require("../utils/mysql.service");
const redis_service_1 = require("../utils/redis.service");
const utils_service_1 = require("../utils/utils.service");
const fs = require('fs');
const crypto = require('crypto');
const zhexecute_service_1 = require("../zh/zhexecute.service");
const fsp = require("fs/promises");
const fs_1 = require("fs");
const path_1 = require("path");
var rep = '\\dist\\admin';
if (__dirname.indexOf('wwwroot') != -1) {
    rep = '/dist/admin';
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
else {
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
const keysPath = __dirname.replace(rep, '/keys/');
const REQ = require('request-promise-native');
const host = require('../../config.json').host;
let ApiService = class ApiService {
    constructor(utils, sql, zhEX, topEX, redis) {
        this.utils = utils;
        this.sql = sql;
        this.zhEX = zhEX;
        this.topEX = topEX;
        this.redis = redis;
        this.linktype = {
            1: 'q',
            2: 'v'
        };
    }
    async pay(body) {
        let { channel, merId, sign } = body;
        let payopen = await this.utils.getsetcache('pay_open', 60);
        if (payopen == '1') {
            if (sign.length == 32) {
                switch (channel) {
                    case '1':
                        let agent = await this.utils.getsetcache('agent', 60);
                        if (agent == '1') {
                            return await this.payqqAgent(body);
                        }
                        else {
                            return await this.payqq(body);
                        }
                        break;
                    case '2':
                        return await this.payvx(body);
                    default:
                        break;
                }
            }
            else {
                switch (channel) {
                    case '1':
                        return await this.payqqRSA(body);
                    case '2':
                        return await this.payqqRSA(body);
                    default:
                        break;
                }
            }
        }
        else {
            return '????????????';
        }
    }
    ;
    async RSAverify(merId, localsign, sign) {
        try {
            let path = (0, path_1.join)(keysPath, `${merId}/public.pem`);
            await fsp.access(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
        }
        catch (_a) {
            throw new common_1.HttpException('?????????????????????', 400);
        }
        let publickey = fs.readFileSync((0, path_1.join)(keysPath, `${merId}/public.pem`)).toString();
        let verify = this.utils.RSApublicVerify(publickey, Buffer.from(localsign), Buffer.from(sign.replace(/ /g, '+'), 'base64'));
        return verify;
    }
    async payqq(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}??????qq??????  ????????????${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('???????????????,???????????????50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('????????????????????????????????????');
                let r = await this.payauto(body);
                return r;
            }
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let arr = [
                `SET @uids := null;`,
                `UPDATE paylink SET  result = 2,merchant_id = ${body.merId},lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${pay_link_lock_time})  WHERE channel = 1 AND  merchant_id=0 AND pay_link is not null AND oid is not null  AND  quota = ${q} AND result = 0 AND is_delete = 0 AND lock_time <= now() AND create_status = 1  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM paylink WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(arr);
            if (r.result && r.data[0]) {
                let { zh, pay_link, oid, zid, zhmark } = r.data[0];
                let { orderId, userId, ip, notifyUrl, orderAmt, channel } = body;
                let tid = this.utils.guid(this.linktype[channel], orderAmt.indexOf('.') > -1 ? orderAmt.split('.')[0] : orderAmt);
                await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zid,zhmark,channel) VALUES ('${tid}','${zh}',${q},${body.merId},'${pay_link}',2,'${oid}','${orderId}','${userId}','${ip}','${notifyUrl}','${zid}','${zhmark}',1)`);
                await this.redis.set(tid, pay_link, 180);
                return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
            }
            else {
                throw new common_1.HttpException('???????????????', 400);
            }
        }
        throw new common_1.HttpException('????????????', 400);
    }
    async payvx(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}??????vx????????????  ????????????${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('???????????????,???????????????1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('????????????', 400);
    }
    async payqqRSA(body) {
        common_1.Logger.log(body);
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}??????qqRSA??????  ????????????${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('???????????????,???????????????50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('????????????????????????????????????');
                let r = await this.payauto(body);
                return r;
            }
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let arr = [
                `SET @uids := null;`,
                `UPDATE paylink SET  result = 2,merchant_id = ${body.merId},lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${pay_link_lock_time})  WHERE channel = 1 AND create_status = 1 AND  merchant_id=0 AND pay_link is not null AND oid is not null  AND  quota = ${q} AND result = 0 AND is_delete = 0 AND lock_time <= now()  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM paylink WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(arr);
            if (r.result && r.data[0]) {
                let { zh, pay_link, oid, zid, zhmark } = r.data[0];
                let { orderId, userId, ip, notifyUrl, orderAmt, channel } = body;
                let tid = this.utils.guid(this.linktype[channel], orderAmt);
                await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zid,zhmark,channel) VALUES ('${tid}','${zh}',${q},${body.merId},'${pay_link}',2,'${oid}','${orderId}','${userId}','${ip}','${notifyUrl}','${zid}','${zhmark}',1)`);
                await this.redis.set(tid, pay_link, 180);
                return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
            }
            else {
                throw new common_1.HttpException('???????????????', 400);
            }
        }
        throw new common_1.HttpException('????????????', 400);
    }
    async payvxRSA(body) {
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}??????vxRSA????????????  ????????????${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('???????????????,???????????????1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('????????????', 400);
    }
    async payauto(body) {
        let q = Number(body.orderAmt) * 100;
        let vx_bock_time = await this.utils.getsetcache('vx_bock_time', 120);
        let arr = [
            `SET @uids := null;`,
            `UPDATE zh SET  balance_lock = 1 ,lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${vx_bock_time})
         WHERE is_delete = 0 AND enable = 1 AND quota >=${q} AND quota-quota_temp >= ${q} AND balance_lock = 0 
         AND zh not in (SELECT zh FROM paylink WHERE channel = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids))   LIMIT 1;`,
            `SELECT * FROM zh WHERE id IN (@uids);`,
        ];
        let zhData = await this.sql.transaction(arr);
        if (zhData.data[0]) {
            let { zh, zid, zhmark } = zhData.data[0];
            let { orderId, userId, ip, notifyUrl, channel, orderAmt } = body;
            let tid = this.utils.guid(this.linktype[channel], orderAmt.indexOf('.') > -1 ? orderAmt.split('.')[0] : orderAmt);
            let insertId = await this.sql.query(`INSERT ignore INTO top_order(tid,zh,zid,quota,merchant_id	,result,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zhmark,channel,create_status ) VALUES ('${tid}','${zh}','${zid}',${q},${body.merId},2,'${orderId}','${userId}','${ip}','${notifyUrl}','${zhmark ? zhmark : ''}',${channel},2)`);
            await this.redis.set(tid, '0', 180);
            let subprocess = await this.topEX.create(zhData.data[0], q, channel, tid);
            return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
        }
        else {
            throw new common_1.HttpException('???????????????', 400);
        }
    }
    ;
    async payquery(body) {
        let { merId } = body;
        let yan = '';
        if (merId && merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        if (localsign === body.sign) {
            common_1.Logger.log("????????????????????????");
            let r = await this.sql.query(`SELECT * FROM top_order WHERE  tid = '${body.orderId}'`);
            if (!r[0]) {
                return '????????????,???????????????';
            }
            else {
                if (r[0].result == 1) {
                    let res = {
                        merId: body.merId,
                        status: 1,
                        orderId: r[0].mer_orderId,
                        sysOrderId: r[0].tid,
                        orderAmt: r[0].quota,
                        nonceStr: this.utils.randomString(16)
                    };
                    let sign = this.ascesign(res, yan);
                    res['sign'] = sign;
                    common_1.Logger.log("????????????");
                    return res;
                }
            }
            let zh = await this.sql.query(`SELECT * FROM zh WHERE zh = '${r[0].zh}'`);
            if (zh[0]) {
                if (zh[0].cookie.indexOf('midas_txcz_openid') == -1 || zh[0].cookie.indexOf('midas_txcz_openkey') == -1) {
                    common_1.Logger.error(`${zh[0].zh}?????????????????????openid???openkey.??????uid:${zh[0].uid}`);
                    return;
                }
                let openidArray = zh[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/);
                let openid = openidArray.length > 1 ? openidArray[1] : common_1.Logger.error("?????????????????????openid");
                let openkeyArray = zh[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/);
                let openkey = openkeyArray.length > 1 ? openkeyArray[1] : common_1.Logger.error("?????????????????????openkey");
                let translist = await this.zhEX.checktranslist(openid, openkey, r[0].zh);
                this.utils.istestlog('api');
                this.utils.istestlog(translist);
                let ispay = 0;
                if (translist && translist.indexOf(r[0].oid) > -1) {
                    let arr = [
                        `UPDATE top_order SET result = 1,err_info='????????????' WHERE tid = '${body.orderId}'`,
                        `UPDATE paylink AS a JOIN (SELECT top_order.oid FROM top_order WHERE tid = '${body.orderId}')b ON a.oid = b.oid  SET result = 1,tid = '${body.orderId}'  `,
                        `UPDATE zh SET quota_total = quota_total + ${r[0].quota} WHERE zid = '${r[0].zid}'`,
                    ];
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
                    ispay = 1;
                    let tNotify = {
                        merId: r[0].merchant_id,
                        orderId: r[0].mer_orderId,
                        sysOrderId: r[0].tid,
                        desc: 'no',
                        orderAmt: (Number(r[0].quota) / 100).toString(),
                        status: ispay.toString(),
                        nonceStr: this.utils.randomString(16),
                        attch: '1'
                    };
                    if (r[0].merchant_id == '6') {
                    }
                    this.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
                }
                let res = {
                    merId: body.merId ? body.merId : 0,
                    status: ispay,
                    orderId: r[0].mer_orderId,
                    sysOrderId: r[0].tid,
                    orderAmt: r[0].quota / 100,
                    nonceStr: this.utils.randomString(16)
                };
                let sign = this.ascesign(res, yan);
                res['sign'] = sign;
                return res;
            }
            return 'ok';
        }
        return '????????????';
    }
    ;
    async notifyRequest(url, notify, yan) {
        let sign = this.ascesign(notify, yan);
        let form = JSON.stringify(notify);
        form = JSON.parse(form);
        form['sign'] = sign;
        common_1.Logger.log(form);
        try {
            let r = await REQ.post({ url: url, form: form });
            if (r && r === 'success') {
                try {
                    await this.sql.query(`UPDATE top_order SET call_back_info = '????????????' WHERE tid = '${notify.sysOrderId}'`);
                }
                catch (error) {
                    common_1.Logger.error(`${notify.sysOrderId}??????????????????: ?????? .??????`);
                }
            }
            common_1.Logger.log(`${url}??????????????????${r}`);
        }
        catch (error) {
            try {
                await this.sql.query(`UPDATE top_order SET call_back_info = '????????????' WHERE tid = '${notify.sysOrderId}'`);
            }
            catch (error) {
                common_1.Logger.error(`${notify.sysOrderId}?????????????????? : ?????? . ??????`);
            }
            common_1.Logger.error(`${url}?????????????????? ${JSON.stringify(error)}`);
        }
    }
    async payqqAgent(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}??????qq??????  ????????????${body.sign}`);
        if (localsign === body.sign) {
            await this.amountRange(Number(body.orderAmt));
            let q = Number(body.orderAmt) * 100;
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let userMinQuota = await this.utils.getsetcache('userMinQuota', 120);
            let channelRate = await this.sql.query(`SELECT * FROM channel WHERE id = ${body.channel} AND enable = 1`);
            if (!channelRate[0])
                throw new Error('?????????????????????????????????');
            channelRate = channelRate[0].rate;
            let lResult = await this.getUid(q);
            let { orderId, userId, ip, notifyUrl, orderAmt, channel } = body;
            let tid = this.utils.guid(this.linktype[channel], orderAmt.indexOf('.') > -1 ? orderAmt.split('.')[0] : orderAmt);
            let arr = [
                ` UPDATE paylink  
        SET result = 2, merchant_id =  ${body.merId}, lock_time = FROM_UNIXTIME(unix_timestamp(now()) +${pay_link_lock_time})    WHERE 
        id = ${lResult.linkid} ;`,
                `UPDATE zh SET quota_temp = quota_temp + ${q} WHERE zid = '${lResult.zid}';`,
                `SELECT cast((a_pid_rate+b_pid_rate+c_pid_rate)/1000 as decimal(9,4)) AS rate_total INTO @rate_total FROM adminuser WHERE uid =  '${lResult.uid}';`,
                `UPDATE adminuser SET quota = quota - ${q}*(${(Math.floor(channelRate / 10000 * 10000) / 10000)}+@rate_total) WHERE uid = '${lResult.uid}';`,
                `INSERT INTO quotalog(action,actionuid,topuid,tid,quota) VALUES('pay','${lResult.uid}','0','${tid}',${q}*(${(Math.floor(channelRate / 10000 * 10000) / 10000)}+@rate_total));`,
                `SELECT *,${q}*(${(Math.floor(channelRate / 10000 * 10000) / 10000)}+@rate_total) AS sub_quota FROM paylink WHERE id = ${lResult.linkid} ;`
            ];
            let r = await this.sql.transaction(arr);
            if (r.result && r.data[0]) {
                let { zh, pay_link, oid, zid, zhmark, uid, sub_quota } = r.data[0];
                await this.sql.query(`INSERT ignore INTO top_order(uid,tid,zh,quota,merchant_id	,pay_link,result,oid,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zid,zhmark,channel,sub_quota) VALUES 
        ('${uid}','${tid}','${zh}',${q},${body.merId},'${pay_link}',2,'${oid}','${orderId}','${userId}','${ip}','${notifyUrl}','${zid}','${zhmark}',1,${sub_quota})`);
                await this.redis.set(tid, pay_link, 180);
                return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
            }
            else {
                throw new common_1.HttpException('???????????????', 400);
            }
        }
        throw new common_1.HttpException('????????????', 400);
    }
    async getUid(q) {
        let userMinQuota = await this.utils.getsetcache('userMinQuota', 120);
        let payQueue = await this.redis.get('payQueue');
        let nowUid = null;
        if (!payQueue) {
            let r = await this.sql.query(`SELECT uid FROM adminuser WHERE quota > ${Number(userMinQuota) * 100} AND pay_open =1 AND up_open = 1`);
            if (!r[0]) {
                common_1.Logger.error(`????????????  ???????????????`);
                throw new common_1.HttpException('???????????????', 400);
            }
            payQueue = r;
            await this.redis.set('payQueue', JSON.stringify(payQueue), 60);
        }
        else {
            payQueue = JSON.parse(payQueue);
        }
        this.utils.istestlog(`????????????  ??????????????????${payQueue.length},????????????${JSON.stringify(payQueue)}`);
        let startUid = null;
        let l = [];
        let last_uid = await this.redis.get('nowUid');
        if (last_uid) {
            this.utils.istestlog(`??????????????? :  ??????????????????${payQueue.length},????????????${JSON.stringify(payQueue)} \n ??????????????????uid ${last_uid}`);
            let index = payQueue.findIndex((item) => {
                return item.uid == last_uid;
            });
            if (index > -1) {
                payQueue = payQueue.slice(index + 1 > payQueue.length ? 0 : index + 1).concat(payQueue.slice(0, index + 1 > payQueue.length ? 0 : index + 1));
            }
        }
        this.utils.istestlog(`??????????????? :  ??????????????????${payQueue.length},????????????${JSON.stringify(payQueue)} \n ??????????????????uid ${last_uid}`);
        do {
            nowUid = payQueue.shift();
            if (!startUid) {
                startUid = nowUid.uid;
            }
            else {
                if (nowUid.uid == startUid) {
                    break;
                }
            }
            payQueue.push(nowUid);
            this.utils.istestlog(`???????????? :\n SELECT a.id FROM paylink AS a JOIN  (select * FROM zh WHERE uid = '${nowUid.uid}' AND quota - quota_temp >= ${q} AND enable = 1)b ON b.zid = a.zid  WHERE a.uid = '${nowUid.uid}'
      AND a.channel = 1
      AND a.merchant_id = 0
      AND a.pay_link is not null
      AND a.oid is not null
      AND a.quota = ${q}
      AND a.result = 0 
      AND a.is_delete = 0 
      AND a.lock_time <= now() 
      AND a.create_status = 1  
      LIMIT 1 \n????????????  ????????????${nowUid.uid}????????????ID:${l[0] ? l[0].id : '???'}`);
            l = await this.sql.query(`SELECT a.id FROM paylink AS a JOIN  (select * FROM zh WHERE uid = '${nowUid.uid}' AND quota - quota_temp >= ${q} AND enable = 1)b ON b.zid = a.zid  WHERE a.uid = '${nowUid.uid}'
        AND a.channel = 1
        AND a.merchant_id = 0
        AND a.pay_link is not null
        AND a.oid is not null
        AND a.quota = ${q}
        AND a.result = 0 
        AND a.is_delete = 0 
        AND a.lock_time <= now() 
        AND a.create_status = 1  
        LIMIT 1`);
        } while (!l[0]);
        if (!l[0]) {
            common_1.Logger.error(`${q} ?????? ???????????????  ???????????????`);
            throw new common_1.HttpException('???????????????', 400);
        }
        else {
            await this.redis.set('nowUid', nowUid.uid, 60 * 60 * 24);
            return { linkid: l[0].id, uid: nowUid.uid, zid: l[0].zid };
        }
    }
    async amountRange(q) {
        let amount = await this.redis.get('amountRange');
        if (!amount) {
            let r = await this.sql.query(`SELECT set_value FROM zhset WHERE set_name = 'amountRange'`);
            if (r[0]) {
                amount = r[0].set_value;
                await this.redis.set('amountRange', amount, 180);
            }
        }
        amount = amount.split(',');
        let result = amount.some((item) => {
            return Number(item) == q;
        });
        if (!result) {
            throw new common_1.HttpException('?????????????????????', 400);
        }
    }
    async getpayurl(body) {
        let { orderid, channel, action } = body;
        if (action == "checkorder") {
            let code = 0;
            let order_info = await this.redis.get(orderid);
            if (!order_info) {
                return { code: -1 };
            }
            let orderinfo = await this.sql.query(`SELECT * FROM top_order WHERE tid = '${orderid}'`);
            let yan = "";
            if (orderinfo[0].merchant_id != '1') {
                orderinfo[0].merchant_id = orderinfo[0].merchant_id.toString().replace ? orderinfo[0].merchant_id.toString().replace(/ /g, '') : orderinfo[0].merchant_id;
                let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${orderinfo[0].merchant_id}`);
                if (tyan[0])
                    yan = `&key=${tyan[0].yan}`;
            }
            let t = {
                merId: orderinfo[0].merchant_id,
                orderId: orderinfo[0].tid,
                nonceStr: this.utils.randomString(16)
            };
            let sign = this.ascesign(t, yan);
            t['sign'] = sign;
            let qres = await this.payquery(t);
            if (typeof qres == 'string') {
                return { code: -1 };
            }
            if (qres.status == 0) {
                code = -1;
            }
            return { code };
        }
        else {
            orderid = orderid.replace(/ /g, '').toLocaleLowerCase();
            let order_info = await this.redis.get(orderid);
            let code = 1, msg = '', url = '';
            if (!order_info) {
                code = 3;
                msg = "????????????,???????????????";
            }
            else if (order_info == '0') {
                code = 2;
            }
            else if (order_info.indexOf('/') > -1) {
                code = 0;
                msg = "??????????????????";
                url = order_info;
            }
            return { code, msg, url };
        }
    }
    ascesign(obj, yan) {
        let newData2 = {}, signData2 = [];
        Object.keys(obj).sort().map(key => {
            newData2[key] = obj[key];
            if (key != 'sign') {
                signData2.push(`${key}=${obj[key]}`);
            }
        });
        let sign = this.utils.md5(signData2.join('&') + yan).toLocaleUpperCase();
        return sign;
    }
    async testreset() {
        await this.sql.query(`UPDATE paylink SET merchant_id = 0 ,result = 0,tid=NULL,lock_time = now();`);
        return 'ok';
    }
    async getonecreate(b, user) {
        let { action } = b;
        let result = null;
        switch (action) {
            case 'getzh':
                let sqlstr = `select * FROM zh WHERE is_delete = 0 AND enable = 1 
    AND uid = '${user.uid}'
    AND quota >=5000 AND quota-quota_temp >= 5000 
    AND balance_lock = 0 AND zh not in (SELECT zh FROM paylink WHERE channel = 1 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400) 
    ORDER BY RAND() LIMIT 1`;
                let r = await this.sql.query(sqlstr);
                if (r[0])
                    result = r[0];
                return result;
            case 'savelink':
                console.log(b);
                let msg = b;
                let zh = await this.sql.query(`select * from zh where zh = '${msg.zh}' AND uid = '${user.uid}'`);
                if (zh[0]) {
                    msg.zid = zh[0].zid;
                }
                else {
                    common_1.Logger.error('???????????????');
                    throw new common_1.HttpException('???????????????', 404);
                }
                let buff = Buffer.from(msg.pay_link, 'base64');
                const str = buff.toString('utf-8');
                let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
                await this.sql.query(`INSERT INTO paylink(uid,zh,quota,pay_link,result,up_time,create_status,oid,zid,lock_time,zhmark) VALUES ('${user.uid}','${msg.zh}',${msg.quota},'${str}',0,now(),1,'${msg.oid}','${msg.zid}',FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}),'${msg.zhmark}')`);
                return 'ok';
            default:
                break;
        }
    }
};
ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_service_1.UtilsService, mysql_service_1.MysqlService, zhexecute_service_1.ZhExecuteService, top_EX_1.TopEXService, redis_service_1.RedisService])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map