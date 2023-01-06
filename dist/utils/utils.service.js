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
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("./mysql.service");
const redis_service_1 = require("./redis.service");
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');
const { escape } = require('mysql');
let UtilsService = class UtilsService {
    constructor(redis, sql) {
        this.redis = redis;
        this.sql = sql;
        this.nowprocess = 0;
        this.maxprocess = 0;
        this.iscreate = false;
        this.testlog = '1';
    }
    randomString(e) {
        e = e || 32;
        var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', a = t.length, n = '';
        for (let i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n;
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    md5(t) {
        return md5(t);
    }
    dayjs() {
        return dayjs();
    }
    dayjsDate(date) {
        return dayjs(date);
    }
    HTTPGET(url) {
    }
    uuid() {
        return uuidv4();
    }
    guid(t, q) {
        let now = new Date().getTime();
        let str = t + `xxxxxxxxx${now}y` + q.toString().padStart(3, '0');
        return str.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    zhguid() {
        let str = `xxxxxxxxxxxxyxxx`;
        return str.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toLocaleUpperCase();
    }
    istestlog(c) {
        if (this.testlog != '1')
            return;
        common_1.Logger.log(c);
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
    async getsetcache(key, time) {
        let open = await this.redis.get(key);
        if (!open) {
            let at = await this.sql.query(`SELECT set_value FROM zhset WHERE  set_name ='${key}'`);
            if (at[0]) {
                open = at[0].set_value;
                await this.redis.set(key, open, time);
            }
            else {
                common_1.Logger.error(`utils => 获取${key} 缓存设置 失败`);
            }
        }
        return open;
    }
    async getsetcachemark(key, time) {
        let open = await this.redis.get(key + 'mark');
        if (!open) {
            let at = await this.sql.query(`SELECT mark FROM zhset WHERE  set_name ='${key}'`);
            if (at[0]) {
                open = at[0].mark;
                await this.redis.set(key + 'mark', open, time);
            }
            else {
                common_1.Logger.error(`utils => 获取${key} 缓存设置 失败`);
            }
        }
        return open;
    }
    RSAgetKeyPair(passphrase) {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicExponent: 0x10001,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase
            }
        });
    }
    RSAcreateKeyPairFile(filePath, passphrase) {
        const { publicKey, privateKey } = this.RSAgetKeyPair(passphrase);
        try {
            fs.writeFileSync(path.join(filePath, 'private.pem'), privateKey, 'utf8');
            fs.writeFileSync(path.join(filePath, 'public.pem'), publicKey, 'utf8');
        }
        catch (err) {
            console.error(err);
        }
    }
    RSApublicEncrypt(data, publicKey, encoding) {
        const msg = JSON.stringify(data);
        const encryptBuffer = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(msg, 'utf8'));
        if (encoding) {
            return encryptBuffer.toString(encoding);
        }
        else {
            return encryptBuffer;
        }
    }
    RSAprivateDecrypt(privateKey, passphrase, encryptBuffer) {
        const msgBuffer = crypto.privateDecrypt({
            key: privateKey,
            passphrase,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, encryptBuffer);
        return JSON.parse(msgBuffer.toString('utf8'));
    }
    RSAprivateSign(privateKey, passphrase, encryptBuffer, encoding) {
        const sign = crypto.createSign('SHA256');
        sign.update(encryptBuffer);
        sign.end();
        const signatureBuffer = sign.sign({
            key: privateKey,
            passphrase
        });
        if (encoding) {
            return signatureBuffer.toString(encoding);
        }
        else {
            return signatureBuffer;
        }
    }
    RSApublicVerify(publicKey, encryptBuffer, signatureBuffer) {
        const verify = crypto.createVerify('SHA256');
        verify.update(encryptBuffer);
        verify.end();
        return verify.verify(publicKey, signatureBuffer);
    }
};
UtilsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService, mysql_service_1.MysqlService])
], UtilsService);
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils.service.js.map