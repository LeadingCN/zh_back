"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 74:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZhController = void 0;
const common_1 = __webpack_require__(6);
const zh_service_1 = __webpack_require__(73);
const create_zh_dto_1 = __webpack_require__(75);
const passport_1 = __webpack_require__(39);
let ZhController = class ZhController {
    constructor(zhService) {
        this.zhService = zhService;
    }
    async create(createZhDto) {
        return await this.zhService.create(createZhDto);
    }
    async findAll(query) {
        return await this.zhService.findAll(query);
    }
    async checkzh() {
        return await this.zhService.checkzh();
    }
    async up(body) {
        return await this.zhService.up(body);
    }
    async gettask(query) {
        return await this.zhService.gettask(query);
    }
    async checktask(query) {
        return await this.zhService.checktask(query);
    }
    async upaqcode(query) {
        return await this.zhService.upaqcode(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('zhcreate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_zh_dto_1.CreateZhDto !== "undefined" && create_zh_dto_1.CreateZhDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('checkzh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "checkzh", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('zhup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "up", null);
__decorate([
    (0, common_1.Get)('gettask'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "gettask", null);
__decorate([
    (0, common_1.Get)('checktask'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "checktask", null);
__decorate([
    (0, common_1.Get)('upaqcode'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZhController.prototype, "upaqcode", null);
ZhController = __decorate([
    (0, common_1.Controller)('zh'),
    __metadata("design:paramtypes", [typeof (_b = typeof zh_service_1.ZhService !== "undefined" && zh_service_1.ZhService) === "function" ? _b : Object])
], ZhController);
exports.ZhController = ZhController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c0a3d29d9cd555c7c05a")
/******/ })();
/******/ 
/******/ }
;