"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 5:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(8);
const serve_static_1 = __webpack_require__(9);
const path_1 = __webpack_require__(10);
const utils_module_1 = __webpack_require__(11);
const auth_module_1 = __webpack_require__(33);
const admin_module_1 = __webpack_require__(45);
const script_module_1 = __webpack_require__(55);
const socket_module_1 = __webpack_require__(58);
const zh_module_1 = __webpack_require__(65);
const top_order_module_1 = __webpack_require__(69);
const sell_order_module_1 = __webpack_require__(73);
const schedule_1 = __webpack_require__(24);
const api_module_1 = __webpack_require__(77);
const pay_link_module_1 = __webpack_require__(82);
const users_module_1 = __webpack_require__(86);
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
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a1540cac03bcf4eff02e")
/******/ })();
/******/ 
/******/ }
;