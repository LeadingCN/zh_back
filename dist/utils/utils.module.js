"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsModule = void 0;
const common_1 = require("@nestjs/common");
const mysql_service_1 = require("./mysql.service");
const redis_service_1 = require("./redis.service");
const utils_service_1 = require("./utils.service");
const redisStore = require("cache-manager-redis-store");
const tasks_service_1 = require("./tasks.service");
const sell_EX_1 = require("../sell_order/sell_EX");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const top_EX_1 = require("../top_order/top_EX");
const api_service_1 = require("../api/api.service");
let UtilsModule = class UtilsModule {
};
UtilsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: 'localhost',
                port: 6379,
            }),
        ],
        controllers: [],
        providers: [utils_service_1.UtilsService, mysql_service_1.MysqlService, redis_service_1.RedisService, tasks_service_1.TasksService, sell_EX_1.SellEXService, zhexecute_service_1.ZhExecuteService, top_EX_1.TopEXService, api_service_1.ApiService],
        exports: [utils_service_1.UtilsService, mysql_service_1.MysqlService, redis_service_1.RedisService, tasks_service_1.TasksService],
    })
], UtilsModule);
exports.UtilsModule = UtilsModule;
//# sourceMappingURL=utils.module.js.map