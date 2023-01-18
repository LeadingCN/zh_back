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
exports.ScriptService = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
let ScriptService = class ScriptService {
    constructor(sql) {
        this.sql = sql;
    }
    async version(query) {
        let { version, appname } = query;
        let r = await this.sql.query(`SELECT * FROM zhset WHERE set_name = '${appname}'`);
        if (r[0]) {
            return { code: 1, version: r[0].set_value, name: 'app.zip', path: 'win/zh/app.zip' };
        }
        else {
            throw new common_1.HttpException('应用不存在', 404);
        }
    }
};
ScriptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mysql_service_1.MysqlService])
], ScriptService);
exports.ScriptService = ScriptService;
//# sourceMappingURL=script.service.js.map