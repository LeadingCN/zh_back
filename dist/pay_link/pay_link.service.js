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
exports.PayLinkService = void 0;
const common_1 = require("@nestjs/common");
const TEMPPATH = require('../../config.json').tempPath;
const path_1 = require("path");
const fsp = require("fs/promises");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
let PayLinkService = class PayLinkService {
    constructor(sql, utils) {
        this.sql = sql;
        this.utils = utils;
        this.mtable = 'paylink';
    }
    async createbyfile(body, user) {
        let fp = (0, path_1.join)(TEMPPATH, body.filenamelist[0].filename);
        let fd = await fsp.readFile(fp);
        let linkArray = fd.toString().split('\r\n');
        let datasql = [];
        let errls = [];
        for (let i = 0; i < linkArray.length; i++) {
            try {
                let zh = linkArray[i].split('----');
                if (zh && zh[1]) {
                    let zid = await this.sql.query(`SELECT zid,mark FROM zh WHERE zh = '${zh[0]}' ${this.isAdmin(user)}`);
                    if (zid[0]) {
                        zh.forEach(e => {
                            e = this.utils.clearData(e);
                        });
                        datasql.push(`('${user.uid}','${zh[0]}',${Number(zh[1]) * 100},'${zh[2]}','${zh[3]}',1,'${zid[0].zid}','${zid[0].mark}','')`);
                    }
                    else {
                        errls.push(i + 1);
                        common_1.Logger.error(`${zh[0]}无法获取zid ,插入链接失败,${JSON.stringify(errls)}`);
                    }
                }
            }
            catch (error) {
                errls.push(i + 1);
                common_1.Logger.error(`第 ${i + 1} 行插入链接失败,${JSON.stringify(errls)}`);
            }
            if (errls.length > 10) {
                throw new common_1.HttpException('超过10条插入失败,请检查上传文本数据', 400);
            }
        }
        if (datasql.length > 0) {
            await this.sql.query(`INSERT ignore INTO paylink(uid,zh,quota,oid,pay_link,create_status,zid,zhmark,lock_time) VALUES ${datasql.join(',')}`);
        }
        common_1.Logger.log(errls.length);
        return { errls };
    }
    async findAll(params, user) {
        let { keyword, pageNum, pageSize, queryType, zid, zhmark, quota } = params;
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let zhmarksql = '';
        if (zhmark) {
            zhmarksql = ` AND zhmark = '${zhmark}'`;
        }
        let quotasql = '';
        if (quota) {
            quota ? quota = Number(quota) * 100 : quota = 0;
            quotasql = ` AND quota = ${quota}`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.mtable} 
     
      WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%') 
      AND (zh LIKE '%${zid ? zid : ''}%' or zid LIKE '%${zid ? zid : ''}%')
      ${quotasql}
      ${queryTypesql}  
      ${zhmarksql}
      AND is_delete = 0 
      ${this.isAdmin(user)}
      `);
        let r = await this.sql.query(`SELECT *,adminuser.username AS username FROM ${this.mtable} 
      LEFT JOIN (
        SELECT uid,username FROM adminuser
      ) adminuser ON adminuser.uid = paylink.uid
      WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%') 
      AND (zh LIKE '%${zid ? zid : ''}%' or zid LIKE '%${zid ? zid : ''}%')
      ${quotasql}
      ${queryTypesql}
      ${zhmarksql}
      AND is_delete = 0
      ${this.isAdmin(user)}
      ORDER BY create_status DESC
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async deletelink(body, user) {
        common_1.Logger.log(body);
        let { oid, list } = body;
        if (list) {
            list = this.utils.clearData(list);
            list = list.split('%2C');
            if (list.length == 1) {
                list = list[0].split(',');
            }
            if (user.roles != 'admin') {
                await this.sql.query(`UPDATE ${this.mtable} SET is_delete = 1 WHERE oid IN ('${list.join("','")}') ${this.isAdmin(user)}`);
            }
            else if (user.roles == 'admin') {
                await this.sql.query(`DELETE FROM ${this.mtable} WHERE oid IN ('${list.join("','")}')`);
            }
        }
        else if (oid) {
            oid = this.utils.clearData(oid);
            if (user.roles != 'admin') {
                await this.sql.query(`UPDATE ${this.mtable} SET is_delete = 1 WHERE oid = '${oid}' ${this.isAdmin(user)}`);
            }
            else if (user.roles == 'admin') {
                await this.sql.query(`DELETE FROM ${this.mtable} WHERE oid = '${oid}'`);
            }
        }
        return 'ok';
    }
    async getonecreate(query) {
        return 'ok';
    }
    isAdmin(user) {
        if (user.roles == 'admin')
            return '';
        return ` AND uid = '${user.uid}'`;
    }
};
PayLinkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        utils_service_1.UtilsService])
], PayLinkService);
exports.PayLinkService = PayLinkService;
//# sourceMappingURL=pay_link.service.js.map