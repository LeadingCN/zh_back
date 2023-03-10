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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
const path_1 = require("path");
const fsp = require("fs/promises");
const redis_service_1 = require("../utils/redis.service");
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
const tempPath = require('../../config.json').tempPath;
let AdminService = class AdminService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async info(user) {
        common_1.Logger.log(`用户信息:${user.username} 登录 ${this.utils.dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
        let resultmenus = [];
        if (user.roles == 'selluser' || user.rolese == 'topuser') {
            common_1.Logger.error(`${user.username}请求登录后台,id:${user.uid}`);
            throw new common_1.HttpException('账号密码错误', 400);
        }
        else {
            let roles = await this.sql.query(`SELECT roles,quota,rate,lv,commission,pay_open FROM adminuser WHERE uid = '${user.uid}' and is_delete = 0`);
            if (!roles[0]) {
                common_1.Logger.error(`${user.username}请求登录后台但后台无该用户数据,id:${user.uid}`);
                throw new common_1.HttpException('账号密码错误', 400);
            }
            else if (roles[0].roles == 'user' || roles[0].roles == 'proxyuser') {
                var roleslist = await this.sql.query(`SELECT menuslist FROM roles WHERE name = '${roles[0].roles}'`);
                var menus = await this.sql.query(`SELECT * FROM menus WHERE id in (${roleslist[0].menuslist})`);
                if (user.lv > 2) {
                    resultmenus = menus.filter(item => item.id <= 6);
                }
                else {
                    resultmenus = menus;
                }
            }
            return {
                icon: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg',
                menus: resultmenus,
                roles: roles[0].roles,
                username: user.username,
                quota: roles[0].quota,
                rate: roles[0].rate,
                lv: roles[0].lv,
                commission: roles[0].commission,
                payopen: roles[0].pay_open
            };
        }
    }
    async list() {
        let result = await this.sql.query(`SELECT username,createTime,note FROM adminuser WHERE is_delete = 0`);
        return result;
    }
    async statictotal(user) {
        let uidsql = '';
        if (user.roles != 'admin') {
            uidsql = ` AND uid = '${user.uid}'`;
        }
        let result = null;
        let statictotal = await this.redis.get('statictotal' + user.uid);
        if (statictotal) {
            result = JSON.parse(statictotal);
        }
        else {
            let ztotal = await this.sql.query(`SELECT COUNT(*) AS total,SUM(balance) AS toptotal FROM zh WHERE is_delete =0 ${uidsql}`);
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let stocklinktotal = await this.sql.query(`SELECT COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND create_status = 1 ${uidsql};`);
            let stocklinktotalclass = await this.sql.query(`SELECT quota,COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND create_status = 1 ${uidsql} GROUP BY quota ;`);
            let tsql = `SELECT paylink.quota,COUNT(*) AS total FROM paylink 
            LEFT JOIN (
            SELECT * FROM zh WHERE is_delete =0  AND enable = 1 
            )zh ON zh.zid = paylink.zid
            LEFT JOIN ( 
            SELECT * FROM adminuser WHERE is_delete =0 AND pay_open = 1 AND up_open = 1 AND quota >= 1000*100
            )adminuser ON adminuser.uid = zh.uid
            WHERE zh.enable = 1 AND adminuser.pay_open = 1 AND adminuser.up_open = 1 AND adminuser.quota >= 1000*100  AND  paylink.is_delete =0 AND paylink.result != 1 AND paylink.channel = 1 AND  paylink.lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND paylink.create_status = 1 ${user.roles != 'admin' ? ` AND paylink.uid = '${user.uid}'` : ''} GROUP BY quota ;`;
            let linktotalclass = await this.sql.query(tsql);
            let linktotal = await this.sql.query(`SELECT COUNT(*) AS total FROM paylink 
            LEFT JOIN (
            SELECT * FROM zh WHERE is_delete =0  AND enable = 1 
            )zh ON zh.zid = paylink.zid
            LEFT JOIN ( 
            SELECT * FROM adminuser WHERE is_delete =0 AND pay_open = 1 AND up_open = 1 AND quota >= 1000*100
            )adminuser ON adminuser.uid = zh.uid
            WHERE zh.enable = 1 AND adminuser.pay_open = 1 AND adminuser.up_open = 1 AND adminuser.quota >= 1000*100  AND paylink.is_delete =0 AND paylink.result != 1 AND paylink.channel = 1 AND  paylink.lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND paylink.create_status = 1 ${user.roles != 'admin' ? ` AND paylink.uid = '${user.uid}'` : ''};`);
            let toptodaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  top_order WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND result = 1 AND channel = 1 ${uidsql}`);
            let topyesterdaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  top_order WHERE TO_DAYS(NOW()) - TO_DAYS(create_time) = 1 AND result = 1 AND channel = 1 ${uidsql}`);
            let paytodaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  sell_order WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND result = 1 ${uidsql}`);
            let payyesterdaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  sell_order WHERE TO_DAYS(NOW()) - TO_DAYS(create_time) = 1 AND result = 1 ${uidsql}`);
            let linktotalclassarr = [];
            for (let i = 0; i < stocklinktotalclass.length; i++) {
                let socktotal = 0;
                for (let j = 0; j < linktotalclass.length; j++) {
                    if (stocklinktotalclass[i].quota == linktotalclass[j].quota) {
                        socktotal = linktotalclass[j].total;
                    }
                }
                linktotalclassarr.push({
                    quota: stocklinktotalclass[i].quota,
                    total: stocklinktotalclass[i].total,
                    socktotal: socktotal
                });
            }
            result = {
                zhtotal: ztotal[0].total,
                toptotal: ztotal[0].toptotal,
                topordertodaytotal: toptodaytotal[0].total,
                toptodaytotal: toptodaytotal[0].quotatotal,
                toporderyesterdaytotal: topyesterdaytotal[0].total,
                topyesterdaytotal: topyesterdaytotal[0].quotatotal,
                payordertodaytotal: paytodaytotal[0].total,
                paytodaytotal: paytodaytotal[0].quotatotal,
                payorderyesterdaytotal: payyesterdaytotal[0].total,
                payyesterdaytotal: payyesterdaytotal[0].quotatotal,
                linktotalclass: linktotalclass,
                linktotal: linktotal[0].total,
                stocklinktotal: stocklinktotal[0].total,
                stocklinktotalclass,
                linktotalclassarr
            };
            await this.redis.set('statictotal', JSON.stringify(result), 30);
        }
        return result;
    }
    async create(body) {
        await this.sql.query(`INSERT INTO adminuser(username,password,note,nickname) VALUES('${body.username}','${this.utils.md5(body.password)}','${body.note}','${body.nickname}')`);
        return 'ok';
    }
    async up(body) {
        await this.sql.query(`UPDATE adminuser SET password = '${this.utils.md5(body.new)}' WHERE username = '${body.selectUser.username}'`);
        return 'ok';
    }
    async deluser(body) {
        if (body.username != 'admin') {
            await this.sql.query(`UPDATE adminuser SET is_delete = 1 WHERE username = '${body.username}'`);
        }
        else {
            throw new common_1.HttpException('超级管理员账号不能删除', 400);
        }
    }
    async repass(body, user) {
        console.log('修改密码', body, user);
        let r = await this.sql.query(`SELECT * FROM adminuser WHERE id = ${user.uid}`);
        if (r[0]) {
            let userinfo = r[0];
            if (userinfo.password == this.utils.md5(body.old) &&
                body.new === body.new1) {
                let md5pass = this.utils.md5(body.new);
                await this.sql.query(`UPDATE adminuser SET password = '${md5pass}' WHERE id = ${user.uid}`);
                return 'ok';
            }
            else {
                throw new common_1.HttpException({ message: '旧密码错误' }, 400);
            }
        }
        throw new common_1.HttpException({ message: '服务器出错' }, 400);
    }
    async upfilename(file, user) {
        if ((file.mimetype != 'text/plain') && (file.mimetype != 'text/csv')) {
            throw new common_1.HttpException('请上存txt/csv格式文件', 400);
        }
        let filename = this.utils.randomString(20);
        let filepath = (0, path_1.join)(tempPath, `${filename}.txt`);
        await fsp.writeFile(filepath, file.buffer);
        common_1.Logger.log(user.username + ' 上传 '
            + "类型:" + file.mimetype + " 文件名:" + filename + " 文件大小:" + file.size + " 字节", '路径', filepath);
        return { filename: filename + '.txt' };
    }
    async setting(body) {
        let { action, data } = body;
        switch (action) {
            case 'get':
                let r = await this.sql.query(`SELECT * FROM zhset `);
                r.forEach(e => {
                    e.edit = false;
                });
                return r;
            case 'save':
                common_1.Logger.log(JSON.stringify(data));
                let { set_value, set_name, id, mark } = data;
                if (id > 0) {
                    await this.sql.query(`UPDATE zhset SET set_value = '${set_value}',set_name = '${set_name}',mark = '${mark}' WHERE id = ${id}`);
                }
                else {
                    await this.sql.query(`INSERT INTO zhset(set_value,set_name,mark) VALUES('${set_value}','${set_name}','${mark}')`);
                }
                await this.redis.set(set_name, set_value, 60);
                break;
            case 'del':
                await this.sql.query(`DELETE FROM zhset WHERE id = ${data.id}`);
            default:
                break;
        }
        return 'ok';
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        utils_service_1.UtilsService,
        redis_service_1.RedisService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map