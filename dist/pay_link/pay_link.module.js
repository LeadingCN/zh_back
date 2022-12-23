"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayLinkModule = void 0;
const common_1 = require("@nestjs/common");
const pay_link_service_1 = require("./pay_link.service");
const pay_link_controller_1 = require("./pay_link.controller");
let PayLinkModule = class PayLinkModule {
};
PayLinkModule = __decorate([
    (0, common_1.Module)({
        controllers: [pay_link_controller_1.PayLinkController],
        providers: [pay_link_service_1.PayLinkService]
    })
], PayLinkModule);
exports.PayLinkModule = PayLinkModule;
//# sourceMappingURL=pay_link.module.js.map