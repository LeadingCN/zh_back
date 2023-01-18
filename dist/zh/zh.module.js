"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhModule = void 0;
const common_1 = require("@nestjs/common");
const zh_service_1 = require("./zh.service");
const zh_controller_1 = require("./zh.controller");
const zhexecute_service_1 = require("./zhexecute.service");
const sell_EX_1 = require("../sell_order/sell_EX");
const mysql_middleware_1 = require("../shared/middleware/mysql.middleware");
let ZhModule = class ZhModule {
    configure(consumer) {
        consumer
            .apply(mysql_middleware_1.MysqlMiddleware)
            .exclude({ path: 'zh/gettask', method: common_1.RequestMethod.GET }, { path: 'zh/checktask', method: common_1.RequestMethod.GET }, { path: 'zh/upaqcode', method: common_1.RequestMethod.GET }, { path: 'zh/checkzh', method: common_1.RequestMethod.GET }, { path: 'zh/zhcreate', method: common_1.RequestMethod.POST })
            .forRoutes(zh_controller_1.ZhController);
    }
};
ZhModule = __decorate([
    (0, common_1.Module)({
        controllers: [zh_controller_1.ZhController],
        providers: [zh_service_1.ZhService, zhexecute_service_1.ZhExecuteService, sell_EX_1.SellEXService]
    })
], ZhModule);
exports.ZhModule = ZhModule;
//# sourceMappingURL=zh.module.js.map