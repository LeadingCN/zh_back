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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptController = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("../utils/mysql.service");
const script_service_1 = require("./script.service");
let ScriptController = class ScriptController {
    constructor(scriptService, sql) {
        this.scriptService = scriptService;
        this.sql = sql;
    }
    async update(query) {
        let version = await this.sql.query(`select * from script_list where id=1`);
        let result = {
            "download_url": version[0].downurl,
            "version": version[0].version,
            "dialog": false,
            "msg": "优化部分问题",
            "force": true,
            "download_timeout": 180
        };
        return result;
    }
    async myupdate(query) {
        let version = await this.sql.query(`select * from script_list where id=1`);
        let result = {};
        if (query.version != version[0].version) {
            result = {
                "download_url": "http://192.168.3.222:3000/script/release.iec",
                "version": "1.0.1",
                "dialog": false,
                "msg": "优化部分问题",
                "force": true,
                "download_timeout": 180
            };
        }
        return result;
    }
    async config(query) {
        return {};
    }
    async winversion(query) {
        return await this.scriptService.version(query);
    }
};
__decorate([
    (0, common_1.Get)('/update'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/myupdate'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "myupdate", null);
__decorate([
    (0, common_1.Get)('/config'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "config", null);
__decorate([
    (0, common_1.Get)("winversion"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "winversion", null);
ScriptController = __decorate([
    (0, common_1.Controller)('script'),
    __metadata("design:paramtypes", [script_service_1.ScriptService,
        mysql_service_1.MysqlService])
], ScriptController);
exports.ScriptController = ScriptController;
//# sourceMappingURL=script.controller.js.map