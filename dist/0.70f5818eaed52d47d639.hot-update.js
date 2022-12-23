"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 33:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiService = void 0;
const common_1 = __webpack_require__(6);
const top_EX_1 = __webpack_require__(32);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
const fs = __webpack_require__(19);
const crypto = __webpack_require__(18);
const zhexecute_service_1 = __webpack_require__(27);
const fsp = __webpack_require__(34);
const fs_1 = __webpack_require__(19);
const path_1 = __webpack_require__(10);
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
const REQ = __webpack_require__(28);
const host = (__webpack_require__(13).host);
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
                        return await this.payqq(body);
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
            return '暂时接单';
        }
    }
    ;
    async RSAverify(merId, localsign, sign) {
        try {
            let path = (0, path_1.join)(keysPath, `${merId}/public.pem`);
            await fsp.access(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
        }
        catch (_a) {
            throw new common_1.HttpException('商户文件不存在', 400);
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
        common_1.Logger.log(`${localsign}   ${merId}拉起qq链接  请求签名${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('额度不正确,订单只支持50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('测试模式动态生成支付金额');
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
                throw new common_1.HttpException('无符合链接', 400);
            }
        }
        throw new common_1.HttpException('校验错误', 400);
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
        common_1.Logger.log(`${localsign}   ${merId}拉起vx动态链接  请求签名${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('额度不正确,订单只支持1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payqqRSA(body) {
        common_1.Logger.log(body);
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}拉起qqRSA链接  请求签名${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('额度不正确,订单只支持50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('测试模式动态生成支付金额');
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
                throw new common_1.HttpException('无符合链接', 400);
            }
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payvxRSA(body) {
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}拉起vxRSA动态链接  请求签名${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('额度不正确,订单只支持1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('校验错误', 400);
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
            throw new common_1.HttpException('无符合链接', 400);
        }
    }
    ;
    async payquery(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}查询订单  请求签名${body.sign}`);
        if (localsign === body.sign) {
            common_1.Logger.log("查询开始");
            let r = await this.sql.query(`SELECT * FROM top_order WHERE  tid = '${body.orderId}'`);
            if (!r[0]) {
                return '查询出错,订单号错误';
            }
            else {
                if (r[0].result == 1) {
                    let res = { merId: body.merId, status: 1, orderId: r[0].mer_orderId, sysOrderId: r[0].tid, orderAmt: r[0].quota, nonceStr: this.utils.randomString(16) };
                    let sign = this.ascesign(res, yan);
                    res['sign'] = sign;
                    return res;
                }
            }
            let zh = await this.sql.query(`SELECT * FROM zh WHERE zh = '${r[0].zh}'`);
            if (zh[0]) {
                let openid = zh[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = zh[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                let translist = await this.zhEX.checktranslist(openid, openkey, r[0].zh);
                let ispay = 0;
                if (translist.indexOf(r[0].oid) > -1) {
                    let arr = [
                        `UPDATE top_order SET result = 1,err_info='支付到账' WHERE tid = '${body.orderId}'`,
                        `UPDATE paylink AS a JOIN (SELECT top_order.oid FROM top_order WHERE tid = '${body.orderId}')b ON a.oid = b.oid  SET result = 1,tid = '${body.orderId}'  `
                    ];
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
                        common_1.Logger.log(r[0]);
                        common_1.Logger.log(tNotify);
                    }
                    this.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
                }
                let res = { merId: body.merId, status: ispay, orderId: r[0].mer_orderId, sysOrderId: r[0].tid, orderAmt: r[0].quota / 100, nonceStr: this.utils.randomString(16) };
                let sign = this.ascesign(res, yan);
                res['sign'] = sign;
                return res;
            }
            return 'ok';
        }
        return '校验错误';
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
                    await this.sql.query(`UPDATE top_order SET call_back_info = '通知成功' WHERE tid = '${notify.sysOrderId}'`);
                }
                catch (error) {
                    common_1.Logger.error(`${notify.sysOrderId}更新回调状态: 成功 .出错`);
                }
            }
            common_1.Logger.log(`${url}回调通知成功${r}`);
        }
        catch (error) {
            try {
                await this.sql.query(`UPDATE top_order SET call_back_info = '通知失败' WHERE tid = '${notify.sysOrderId}'`);
            }
            catch (error) {
                common_1.Logger.error(`${notify.sysOrderId}更新回调状态 : 失败 . 出错`);
            }
            common_1.Logger.error(`${url}回调通知失败 ${JSON.stringify(error)}`);
        }
    }
    async getpayurl(body) {
        let { orderid, channel } = body;
        orderid = orderid.replace(/ /g, '').toLocaleLowerCase();
        let order_info = await this.redis.get(orderid);
        let code = 1, msg = '', url = '';
        if (!order_info) {
            code = 3;
            msg = "订单超时,请重新拉取";
        }
        else if (order_info == '0') {
            code = 2;
        }
        else if (order_info.indexOf('/') > -1) {
            code = 0;
            msg = "马上点击支付";
            url = order_info;
        }
        return { code, msg, url };
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
        console.log(b, 'getonecreate', user);
        if (!user)
            throw new common_1.HttpException('请先登录', 401);
        let { action } = b;
        let result = null;
        switch (action) {
            case 'getzh':
                let sqlstr = `select * FROM zh WHERE is_delete = 0 AND enable = 1 
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
                let zh = await this.sql.query(`select * from zh where zh = '${msg.zh}'`);
                if (zh[0]) {
                    msg.zid = zh[0].zid;
                }
                else {
                    throw new common_1.HttpException('账号不存在', 404);
                }
                common_1.Logger.log(msg.pay_link);
                let buff = Buffer.from(msg.pay_link, 'base64');
                const str = buff.toString('utf-8');
                common_1.Logger.log(str);
                let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
                await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,lock_time) VALUES ('${msg.zh}',${msg.quota},'${msg.pay_link}',0,now(),1,'${msg.oid}','${msg.zid}',FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}))`);
                return 'ok';
            default:
                break;
        }
    }
};
ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _a : Object, typeof (_b = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _b : Object, typeof (_c = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _c : Object, typeof (_d = typeof top_EX_1.TopEXService !== "undefined" && top_EX_1.TopEXService) === "function" ? _d : Object, typeof (_e = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _e : Object])
], ApiService);
exports.ApiService = ApiService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("6363097de3884eb24559")
/******/ })();
/******/ 
/******/ }
;