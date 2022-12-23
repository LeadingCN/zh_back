"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLMiddleware = void 0;
const common_1 = require("@nestjs/common");
let XMLMiddleware = class XMLMiddleware {
    use(req, res, next) {
        console.log('进入全局中间件...', req.url);
        if (req.header['content-type'] && req.header['content-type'].includes('application/xml')) {
        }
        next();
    }
};
XMLMiddleware = __decorate([
    (0, common_1.Injectable)()
], XMLMiddleware);
exports.XMLMiddleware = XMLMiddleware;
//# sourceMappingURL=xml.middleware.js.map