"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 11:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UtilsModule = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
const redisStore = __webpack_require__(22);
const tasks_service_1 = __webpack_require__(23);
const sell_EX_1 = __webpack_require__(27);
const zhexecute_service_1 = __webpack_require__(25);
const top_EX_1 = __webpack_require__(30);
const api_service_1 = __webpack_require__(31);
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


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d2dc7af0cc5694b86c87")
/******/ })();
/******/ 
/******/ }
;