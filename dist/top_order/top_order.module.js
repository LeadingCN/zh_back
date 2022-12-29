"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopOrderModule = void 0;
const common_1 = require("@nestjs/common");
const top_order_service_1 = require("./top_order.service");
const top_order_controller_1 = require("./top_order.controller");
const top_EX_1 = require("./top_EX");
const zhexecute_service_1 = require("../zh/zhexecute.service");
const api_service_1 = require("../api/api.service");
const mysql_middleware_1 = require("../shared/middleware/mysql.middleware");
let TopOrderModule = class TopOrderModule {
    configure(consumer) {
        consumer
            .apply(mysql_middleware_1.MysqlMiddleware)
            .forRoutes({ path: 'top-order/*', method: common_1.RequestMethod.ALL });
    }
};
TopOrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [top_order_controller_1.TopOrderController],
        providers: [top_order_service_1.TopOrderService, top_EX_1.TopEXService, zhexecute_service_1.ZhExecuteService, api_service_1.ApiService]
    })
], TopOrderModule);
exports.TopOrderModule = TopOrderModule;
//# sourceMappingURL=top_order.module.js.map