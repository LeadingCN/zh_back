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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mysql_service_1 = require("../utils/mysql.service");
const utils_service_1 = require("../utils/utils.service");
let AuthService = class AuthService {
    constructor(jwtService, utils, sql) {
        this.jwtService = jwtService;
        this.utils = utils;
        this.sql = sql;
    }
    async validateUser(username, pass) {
        const user = await this.sql.query(`SELECT * FROM adminuser WHERE username = '${username}'`);
        if (user[0] && user[0].password === pass) {
            return user[0];
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.username,
            uid: user.id,
            roles: user.roles,
        };
        if (user.roles == 'admin') {
            return {
                token: this.jwtService.sign(payload),
                tokenHead: 'Bearer ',
                username: user.username,
                id: user.id,
                roles: user.roles,
            };
        }
        else {
            return {
                token: this.jwtService.sign(payload),
                tokenHead: 'Bearer ',
            };
        }
    }
    jwtDecode(token) {
        return this.jwtService.decode(token.split(' ')[1]);
    }
    jwtDecodeByQuery(token) {
        return this.jwtService.decode(token);
    }
    async userlogin(query) {
        let { username, password } = query;
        username = username.replace(/ /g, '');
        password = password.replace(/ /g, '').toLocaleUpperCase();
        const user = await this.sql.query(`SELECT * FROM user WHERE username = '${username}'`);
        if (user[0] && user[0].password === password) {
            const payload = {
                username: user[0].username,
                uid: user[0].id,
                roles: user[0].roles,
            };
            return {
                token: this.jwtService.sign(payload)
            };
        }
        return null;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        utils_service_1.UtilsService,
        mysql_service_1.MysqlService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map