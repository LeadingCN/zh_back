"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelModule = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const channel_controller_1 = require("./channel.controller");
const mysql_middleware_1 = require("../shared/middleware/mysql.middleware");
let ChannelModule = class ChannelModule {
    configure(consumer) {
        consumer
            .apply(mysql_middleware_1.MysqlMiddleware)
            .forRoutes({ path: 'channel/*', method: common_1.RequestMethod.ALL });
    }
};
ChannelModule = __decorate([
    (0, common_1.Module)({
        controllers: [channel_controller_1.ChannelController],
        providers: [channel_service_1.ChannelService]
    })
], ChannelModule);
exports.ChannelModule = ChannelModule;
//# sourceMappingURL=channel.module.js.map