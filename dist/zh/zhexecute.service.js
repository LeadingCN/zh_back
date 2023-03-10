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
exports.ZhExecuteService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
const redis_service_1 = require("../utils/redis.service");
const TEMPPATH = require('../../config.json').tempPath;
const REQ = require('request-promise-native');
const h = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
};
let ZhExecuteService = class ZhExecuteService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
        this.zh_table = "zh";
    }
    async upquota(action, body, user) {
        if (action == 'all') {
            let z = await this.sql.query(`SELECT zh,cookie FROM zh WHERE is_delete = 0 ${user === 0 ? '' : `AND uid = '${user.uid}'`}`);
            for (let i = 0; i < z.length; i++) {
                let openid = z[i].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = z[i].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                await this.up(openid, openkey, z[i].zh);
            }
        }
        else {
            let z = await this.sql.query(`SELECT zh,cookie FROM zh WHERE zid = '${body.zid}'`);
            if (z[0]) {
                let openid = z[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = z[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                await this.up(openid, openkey, z[0].zh);
            }
        }
    }
    async upbyzh(zh) {
        let z = await this.sql.query(`SELECT zh,cookie FROM zh WHERE zh = ${zh}`);
        if (z[0]) {
            let openid = z[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
            let openkey = z[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
            return await this.up(openid, openkey, z[0].zh);
        }
        return 0;
    }
    async checktranslist(openid, openkey, zh) {
        let translist = await this.redis.get(`translist_${zh}`);
        if (translist) {
            return translist;
        }
        let url = 'https://api.unipay.qq.com/v1/r/1450000186/trade_record_query';
        let form = {
            CmdCode: 'query2',
            SubCmdCode: 'default',
            PageNum: '1',
            BeginUnixTime: '1635417724',
            EndUnixTime: parseInt((new Date().getTime() / 1000).toString()).toString(),
            PageSize: '100',
            SystemType: 'portal',
            pf: '__mds_default',
            pfkey: 'pfkey',
            from_h5: '1',
            webversion: 'MidasTradeRecord1.0',
            openid: openid,
            openkey: openkey,
            session_id: 'openid',
            session_type: 'kp_accesstoken',
        };
        let res = await REQ.post({ url: url, headers: h, form: form });
        try {
            let body = JSON.parse(res);
            if (res && body.msg === 'ok') {
                await this.redis.set(`translist_${zh}`, JSON.stringify(body), 10);
                return res;
            }
            if (res && body.msg === '??????????????????') {
                common_1.Logger.error(`${zh}   ===   cookie ?????? `);
                return false;
            }
        }
        catch (error) {
            common_1.Logger.error(`????????????????????????${error}`);
        }
        return '';
    }
    async up(openid, openkey, zh) {
        if (openid && openkey && zh) {
            this.utils.istestlog(`${zh}?????????????????? . oid => ${openid} . okey => ${openkey}`);
            let upurl = `https://api.unipay.qq.com/v1/r/1450000186/wechat_query?cmd=4&pf=mds_storeopen_qb-__mds_default_-html5&pfkey=pfkey&from_h5=1&from_https=1&sandbox=&openid=${openid}&openkey=${openkey}&session_id=openid&session_type=kp_accesstoken&WxAppid=wx951bdcac522929b6&qq_appid=101502376&offerId=1450000186`;
            try {
                let res = await REQ.get({ url: upurl, resolveWithFullResponse: true, headers: h });
                if (res.statusCode === 200) {
                    let body = JSON.parse(res.body);
                    console.log(`${zh}??????${Number(body.qb_balance) / 100}`);
                    await this.sql.query(`UPDATE zh SET balance = ${body.qb_balance} WHERE zh = ${zh}`);
                    return body.qb_balance;
                }
            }
            catch (error) {
                common_1.Logger.error(`${zh}??????????????????${JSON.stringify(error)}`);
            }
        }
        else {
            common_1.Logger.error(`${zh}??????????????????`);
        }
        return 0;
    }
};
ZhExecuteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService, utils_service_1.UtilsService,
        redis_service_1.RedisService])
], ZhExecuteService);
exports.ZhExecuteService = ZhExecuteService;
//# sourceMappingURL=zhexecute.service.js.map