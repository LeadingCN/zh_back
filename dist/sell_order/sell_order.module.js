"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellOrderModule = void 0;
const common_1 = require("@nestjs/common");
const sell_order_service_1 = require("./sell_order.service");
const sell_order_controller_1 = require("./sell_order.controller");
const sell_EX_1 = require("./sell_EX");
const zhexecute_service_1 = require("../zh/zhexecute.service");
let SellOrderModule = class SellOrderModule {
};
SellOrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [sell_order_controller_1.SellOrderController],
        providers: [sell_order_service_1.SellOrderService, sell_EX_1.SellEXService, zhexecute_service_1.ZhExecuteService]
    })
], SellOrderModule);
exports.SellOrderModule = SellOrderModule;
//# sourceMappingURL=sell_order.module.js.map