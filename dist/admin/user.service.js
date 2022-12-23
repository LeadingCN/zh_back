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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
const path_1 = require("path");
const fsp = require("fs/promises");
const fs_1 = require("fs");
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
const keysPath = __dirname.replace(rep, '/keys/');
let UserService = class UserService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async findAll(params) {
        let { keyword, pageNum, pageSize } = params;
        let total = await this.sql.query(`SELECT count(1) AS count FROM user WHERE username LIKE '%${keyword ? keyword : ''}%' `);
        let r = await this.sql.query(`SELECT * FROM user WHERE username LIKE '%${keyword ? keyword : ''}%' 
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            quotatotal: total[0].quotatotal,
            list: r,
        };
    }
    async createuser(body) {
        let { nickName } = body;
        try {
            let username = this.utils.randomString(8);
            let password = this.utils.randomString(8);
            let salt = this.utils.randomString(8);
            let r = await this.sql.query(`INSERT INTO user (username,password,yan,nickName,status,note,email,icon,roles) VALUES ('${username}','${this.utils.md5(password)}','${salt}','${nickName}',1,'','','','top')`);
            let path = (0, path_1.join)(keysPath, `${r.insertId}`);
            await fsp.mkdir(path);
            this.utils.RSAcreateKeyPairFile(path, '');
            common_1.Logger.log(`用户${username}创建成功,密码为${password},盐为${salt}`);
        }
        catch (error) {
            common_1.Logger.error(error);
        }
        return 'ok';
    }
    async topuserupdate(body) {
        let { action, data } = body;
        switch (action) {
            case 'delete':
                await this.sql.query(`DELETE FROM user WHERE id=${data.id}`);
                let path = (0, path_1.join)(keysPath, `${data.id}`);
                try {
                    await fsp.access(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
                    await fsp.rmdir(path, { recursive: true });
                }
                catch (_a) {
                    console.error('cannot access');
                }
                break;
            case 'downkeys':
                let path1 = (0, path_1.join)(keysPath, `${data.id}`);
                try {
                    await fsp.access(path1, fs_1.constants.R_OK | fs_1.constants.W_OK);
                    let publickey = await fsp.readFile((0, path_1.join)(path1, 'public.pem'), 'utf8');
                    let privatekey = await fsp.readFile((0, path_1.join)(path1, 'private.pem'), 'utf8');
                    let keys = publickey + '\r\n' + privatekey;
                    return keys;
                }
                catch (_b) {
                    throw new common_1.HttpException('秘钥文件不存在', 400);
                }
            case 'updatepass':
                let { id, password } = data;
                await this.sql.query(`UPDATE user SET password='${this.utils.md5(password)}' WHERE id=${id}`);
                break;
            default:
                break;
        }
        return 'ok';
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService,
        utils_service_1.UtilsService,
        redis_service_1.RedisService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map