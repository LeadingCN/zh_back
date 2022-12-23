"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 73:
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZhService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const path_1 = __webpack_require__(10);
const fsp = __webpack_require__(34);
const zhexecute_service_1 = __webpack_require__(27);
const utils_service_1 = __webpack_require__(17);
const sell_EX_1 = __webpack_require__(29);
const TEMPPATH = (__webpack_require__(13).tempPath);
let ZhService = class ZhService {
    constructor(sql, ex, utils, sell_EX) {
        this.sql = sql;
        this.ex = ex;
        this.utils = utils;
        this.sell_EX = sell_EX;
        this.zh_table = "zh";
    }
    async create(body) {
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
                datasql.push(`('${zh[0]}','${zh[1]}','${zuid}')`);
            }
            else {
                error.push(i);
            }
        });
        await this.sql.query(`INSERT ignore INTO ${this.zh_table}(zh,cookie,zid) VALUE ${datasql.join(',')}`);
        return error.length > 0 ? error : 'ok';
    }
    async findAll(params) {
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.zh_table} WHERE zh LIKE '%${params.keyword ? params.keyword : ''}%' AND is_delete = 0`);
        let r = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE zh LIKE '%${params.keyword ? params.keyword : ''}%' AND is_delete = 0  LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async up(body) {
        console.log(body);
        if (body.action == 'del') {
            let whosql = ``;
            if (body.list) {
                whosql = `id in (${body.list.join(',')})`;
            }
            else {
                whosql = `id = ${body.id}`;
            }
            await this.sql.query(`UPDATE ${this.zh_table} SET is_delete = 1 WHERE  ${whosql}`);
        }
        else if (body.action == 'quota') {
            let whosql = ``;
            if (body.list) {
                whosql = `id in (${body.list.join(',')})`;
            }
            else {
                whosql = `id = ${body.id}`;
            }
            console.log(`UPDATE ${this.zh_table} SET quota = ${Number(body.quota) * 100} WHERE  ${whosql}`);
            await this.sql.query(`UPDATE ${this.zh_table} SET quota = ${body.quota} WHERE  ${whosql}`);
        }
        else if (body.action == 'enable') {
            await this.sql.query(`UPDATE ${this.zh_table} SET enable = ${body.enable} WHERE id = ${body.id}`);
        }
        else if (body.action == 'cookie') {
            await this.sql.query(`UPDATE ${this.zh_table} SET cookie = ${body.cookie} WHERE id = ${body.id}`);
        }
        else if (body.action == 'upquotaall') {
            await this.ex.upquota('all', body);
        }
        else if (body.action == 'upquota') {
            await this.ex.upquota('upquota', body);
        }
        return 'ok';
    }
    async checkzh() {
        this.checkzhScript();
        return 'ok';
    }
    async checkzhScript() {
        let zh = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE is_delete = 0 `);
        for (let i = 0; i < zh.length; i++) {
            await this.sell_EX.create({
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
};
ZhService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _b : Object, typeof (_c = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _c : Object, typeof (_d = typeof sell_EX_1.SellEXService !== "undefined" && sell_EX_1.SellEXService) === "function" ? _d : Object])
], ZhService);
exports.ZhService = ZhService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b00032fa4c243365d024")
/******/ })();
/******/ 
/******/ }
;