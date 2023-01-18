"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const utils_module_1 = require("./utils/utils.module");
const auth_module_1 = require("./auth/auth.module");
const admin_module_1 = require("./admin/admin.module");
const script_module_1 = require("./script/script.module");
const socket_module_1 = require("./socket/socket.module");
const zh_module_1 = require("./zh/zh.module");
const top_order_module_1 = require("./top_order/top_order.module");
const sell_order_module_1 = require("./sell_order/sell_order.module");
const schedule_1 = require("@nestjs/schedule");
const api_module_1 = require("./api/api.module");
const pay_link_module_1 = require("./pay_link/pay_link.module");
const users_module_1 = require("./users/users.module");
const channel_module_1 = require("./channel/channel.module");
const commission_module_1 = require("./commission/commission.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            utils_module_1.UtilsModule,
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            script_module_1.ScriptModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            socket_module_1.SocketModule,
            zh_module_1.ZhModule,
            top_order_module_1.TopOrderModule,
            sell_order_module_1.SellOrderModule,
            api_module_1.ApiModule,
            pay_link_module_1.PayLinkModule,
            users_module_1.UsersModule,
            channel_module_1.ChannelModule,
            commission_module_1.CommissionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map