/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(80);
const validation_pipe_1 = __webpack_require__(51);
const http_exception_filter_1 = __webpack_require__(89);
const xml_middleware_1 = __webpack_require__(90);
const auth_guard_1 = __webpack_require__(91);
const response_interceptor_1 = __webpack_require__(92);
const auth_service_1 = __webpack_require__(34);
const cors_1 = __webpack_require__(94);
const config = __webpack_require__(13);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use(new xml_middleware_1.XMLMiddleware().use);
    const auth = app.get(auth_service_1.AuthService);
    app.useGlobalGuards(new auth_guard_1.JwtAuthGuard(new core_1.Reflector(), auth));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.enableCors(cors_1.default);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(config.port);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    console.log = function log() {
        return;
    };
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(8);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
};
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(6);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/serve-static");

/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MysqlService = void 0;
const common_1 = __webpack_require__(6);
const sqlconfig = (__webpack_require__(13).sql);
var mysql = __webpack_require__(14);
const pool = mysql.createPool(sqlconfig);
pool.on('release', function (connection) {
});
let MysqlService = class MysqlService {
    async getConnection() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                resolve(conn);
            });
        }).catch((e) => {
            common_1.Logger.error('获取mysql连接池子 连接对象失败');
            throw new common_1.HttpException('服务器出错', 400);
        });
    }
    async query(sql) {
        let conn = await this.getConnection();
        return new Promise((resolve, reject) => {
            conn.query(sql, (err, results, fields) => {
                conn.release();
                if (err) {
                    common_1.Logger.error('数据库发生错误', err);
                    reject(err);
                }
                resolve(results);
            });
        }).catch((e) => {
            throw new common_1.HttpException('数据库发生错误', 400);
        });
    }
    async transactionQuery(conn, sql) {
        return new Promise((resolve, reject) => {
            conn.query(sql, async (err, results, fields) => {
                if (err) {
                    common_1.Logger.error(`事务导致数据库出错 \r\n  错误: \r\n ${err}  `);
                    reject(err);
                }
                resolve({ data: results, result: true });
            });
        }).catch((e) => {
            return { data: e, result: false };
        });
    }
    async transaction(sql) {
        let connection = await this.getConnection();
        return new Promise((resolve, reject) => {
            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    common_1.Logger.error('开启事务失败', err);
                    reject('开启事务失败');
                }
                else {
                    let i, r;
                    for (i = 0; i < sql.length; i++) {
                        r = await this.transactionQuery(connection, sql[i]);
                        if (!r.result) {
                            i = 999;
                            connection.rollback(() => {
                                connection.release();
                                reject(r.data.sql);
                            });
                            break;
                        }
                    }
                    if (i != 999) {
                        connection.commit((error) => {
                            if (error) {
                                common_1.Logger.error('事务提交失败', error);
                                reject('事务提交失败');
                            }
                        });
                        connection.release();
                        resolve(r);
                    }
                }
            });
        })
            .then((e) => {
            return e;
        })
            .catch((e) => {
            throw new common_1.HttpException('失败:服务器出错', 400);
        });
    }
};
MysqlService = __decorate([
    (0, common_1.Injectable)()
], MysqlService);
exports.MysqlService = MysqlService;


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"host":"127.0.0.1:3000","jwt":{"expiresInTime":"30d","jwtSecret":"fuck_qq_very"},"sql222":{"connectionLimit":"5","host":"107.148.9.20","port":"3306","user":"root","password":"520AAAfiuAa+","database":"czxt"},"sql":{"connectionLimit":"5","host":"bt.leading.ren","port":"3306","user":"czxt","password":"Jc8DHRtM2fKJdkmC","database":"czxt"},"tempPath":"D:\\\\0git\\\\0myJob\\\\feng_zh_handler\\\\zh_handler_back\\\\public\\\\temp","port":3000,"scriptPath":"D:\\\\0git\\\\0myJob\\\\feng_zh_handler\\\\zh_puppeteer\\\\script\\\\zh.js"}');

/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("mysql");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(6);
const cache_manager_1 = __webpack_require__(16);
let RedisService = class RedisService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        return await this.cacheManager.get(key);
    }
    async set(key, value, t) {
        return await this.cacheManager.set(key, value, { ttl: t });
    }
    async del(key) {
        return await this.cacheManager.del(key);
    }
    async reset() {
        return await this.cacheManager.reset();
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeof (_a = typeof cache_manager_1.Cache !== "undefined" && cache_manager_1.Cache) === "function" ? _a : Object])
], RedisService);
exports.RedisService = RedisService;


/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("cache-manager");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UtilsService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const crypto = __webpack_require__(18);
const fs = __webpack_require__(19);
const path = __webpack_require__(10);
const md5 = __webpack_require__(20);
const dayjs = __webpack_require__(21);
let UtilsService = class UtilsService {
    constructor(redis, sql) {
        this.redis = redis;
        this.sql = sql;
        this.nowprocess = 0;
        this.maxprocess = 0;
        this.iscreate = false;
    }
    randomString(e) {
        e = e || 32;
        var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', a = t.length, n = '';
        for (let i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n;
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    md5(t) {
        return md5(t);
    }
    dayjs() {
        return dayjs();
    }
    dayjsDate(date) {
        return dayjs(date);
    }
    HTTPGET(url) {
    }
    guid(t, q) {
        let now = new Date().getTime();
        let str = t + `xxxxxxxxx${now}y` + q.toString().padStart(3, '0');
        return str.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    zhguid() {
        let str = `xxxxxxxxxxxxyxxx`;
        return str.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toLocaleUpperCase();
    }
    async getsetcache(key, time) {
        let open = await this.redis.get(key);
        if (!open) {
            let at = await this.sql.query(`SELECT set_value FROM zhset WHERE  set_name ='${key}'`);
            if (at[0]) {
                open = at[0].set_value;
                await this.redis.set(key, open, time);
            }
            else {
                common_1.Logger.error(`utils => 获取${key} 缓存设置 失败`);
            }
        }
        return open;
    }
    async getsetcachemark(key, time) {
        let open = await this.redis.get(key + 'mark');
        if (!open) {
            let at = await this.sql.query(`SELECT mark FROM zhset WHERE  set_name ='${key}'`);
            if (at[0]) {
                open = at[0].mark;
                await this.redis.set(key + 'mark', open, time);
            }
            else {
                common_1.Logger.error(`utils => 获取${key} 缓存设置 失败`);
            }
        }
        return open;
    }
    RSAgetKeyPair(passphrase) {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicExponent: 0x10001,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase
            }
        });
    }
    RSAcreateKeyPairFile(filePath, passphrase) {
        const { publicKey, privateKey } = this.RSAgetKeyPair(passphrase);
        try {
            fs.writeFileSync(path.join(filePath, 'private.pem'), privateKey, 'utf8');
            fs.writeFileSync(path.join(filePath, 'public.pem'), publicKey, 'utf8');
        }
        catch (err) {
            console.error(err);
        }
    }
    RSApublicEncrypt(data, publicKey, encoding) {
        const msg = JSON.stringify(data);
        const encryptBuffer = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(msg, 'utf8'));
        if (encoding) {
            return encryptBuffer.toString(encoding);
        }
        else {
            return encryptBuffer;
        }
    }
    RSAprivateDecrypt(privateKey, passphrase, encryptBuffer) {
        const msgBuffer = crypto.privateDecrypt({
            key: privateKey,
            passphrase,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, encryptBuffer);
        return JSON.parse(msgBuffer.toString('utf8'));
    }
    RSAprivateSign(privateKey, passphrase, encryptBuffer, encoding) {
        const sign = crypto.createSign('SHA256');
        sign.update(encryptBuffer);
        sign.end();
        const signatureBuffer = sign.sign({
            key: privateKey,
            passphrase
        });
        if (encoding) {
            return signatureBuffer.toString(encoding);
        }
        else {
            return signatureBuffer;
        }
    }
    RSApublicVerify(publicKey, encryptBuffer, signatureBuffer) {
        const verify = crypto.createVerify('SHA256');
        verify.update(encryptBuffer);
        verify.end();
        return verify.verify(publicKey, signatureBuffer);
    }
};
UtilsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _a : Object, typeof (_b = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _b : Object])
], UtilsService);
exports.UtilsService = UtilsService;


/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("md5");

/***/ }),
/* 21 */
/***/ ((module) => {

"use strict";
module.exports = require("dayjs");

/***/ }),
/* 22 */
/***/ ((module) => {

"use strict";
module.exports = require("cache-manager-redis-store");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const common_1 = __webpack_require__(6);
const schedule_1 = __webpack_require__(24);
const mysql_service_1 = __webpack_require__(12);
const utils_service_1 = __webpack_require__(17);
const zhexecute_service_1 = __webpack_require__(25);
const sell_EX_1 = __webpack_require__(27);
const os = __webpack_require__(29);
const redis_service_1 = __webpack_require__(15);
const top_EX_1 = __webpack_require__(30);
const api_service_1 = __webpack_require__(31);
let TasksService = class TasksService {
    constructor(sql, sell_ex, top_ex, zh_ex, utils, redis, api) {
        this.sql = sql;
        this.sell_ex = sell_ex;
        this.top_ex = top_ex;
        this.zh_ex = zh_ex;
        this.utils = utils;
        this.redis = redis;
        this.api = api;
        this.utils.maxprocess = os.cpus().length;
        common_1.Logger.log('Task =>' + `have ${this.utils.maxprocess} cpu,run ${this.utils.nowprocess} cpu`);
    }
    async vx_top_order_handler() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        if (this.utils.nowprocess < this.utils.maxprocess) {
            let outtime = await this.utils.getsetcache('order_outtime', 60);
            let toparr = [
                `SET @uids := null;`,
                `UPDATE top_order SET  create_status = 2 
         WHERE is_delete = 0 AND channel = 2  AND unix_timestamp(NOW())-unix_timestamp(create_time) < ${outtime} AND create_status = 0 AND result = 2
         AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1;`,
                `SELECT * FROM top_order WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(toparr);
            if (r.result && r.data[0]) {
                common_1.Logger.log('有尚未处理的微信订单');
                r = r.data[0];
                let vx_bock_time = await this.utils.getsetcache('vx_bock_time', 120);
                let arr = [
                    `SET @uids := null;`,
                    `UPDATE zh SET  balance_lock = 1 ,lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${vx_bock_time})
         WHERE is_delete = 0 AND enable = 1 AND quota >=${r.quota} AND quota-quota_temp >= ${r.quota} AND balance_lock = 0 
         AND zh not in (SELECT zh FROM paylink WHERE channel = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1;`,
                    `SELECT * FROM zh WHERE id IN (@uids);`,
                ];
                let zhData = await this.sql.transaction(arr);
                if (zhData.data[0]) {
                    common_1.Logger.log('有可用于vx链接支付的账号');
                    this.top_ex.create(zhData.data[0], r.quota, 2, r.tid);
                }
            }
        }
    }
    async sell_order_task() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        if (this.utils.nowprocess < this.utils.maxprocess) {
            let checkorder = [
                `SET @uids := null;`,
                `UPDATE sell_order SET result = 2 WHERE isNULL(pay_zh) and result = 0 AND is_delete = 0  AND unix_timestamp(NOW())-unix_timestamp(create_time) < 180 AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM sell_order WHERE id IN (@uids) ;`,
            ];
            let r = await this.sql.transaction(checkorder);
            if (r.result && r.data[0]) {
                let s_order = {
                    top_zh: r.data[0].top_zh,
                    game_type: r.data[0].game_type,
                    game_qu: r.data[0].game_qu,
                    quota: r.data[0].quota / 100,
                    merchant_id: r.data[0].merchant_id,
                    sellid: r.data[0].id
                };
                let checkZH = [
                    `SET @uids := null;`,
                    `UPDATE zh SET balance = balance - ${Number(s_order.quota) * 100} ,	balance_lock = 1,lock_time = now() WHERE is_delete = 0 AND balance - ${s_order.quota * 100} > 0 AND 	balance_lock = 0 AND enable = 1  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                    `SELECT * FROM zh WHERE id IN (@uids) ;`,
                ];
                let zh = await this.sql.transaction(checkZH);
                if (zh.result && zh.data[0]) {
                    let zhData = zh.data[0];
                    common_1.Logger.log('Task =>' + "match zh:" + zhData.zh + ',update order ');
                    let n = await this.zh_ex.upbyzh(zhData.zh);
                    common_1.Logger.log(n);
                    if (Number(n) > s_order.quota * 100) {
                        await this.sql.query(`UPDATE sell_order SET pay_zh = '${zhData.zh}',before_quota=${zhData.balance + Number(s_order.quota) * 100},result = 2,err_info=NULL WHERE id = ${r.data[0].id}`);
                        common_1.Logger.log('Task =>' + "action");
                        this.sell_ex.create(s_order, zhData);
                    }
                    else {
                    }
                }
                else {
                    common_1.Logger.log('Task =>' + `no zh,sell_id => ${r.data[0].id} quota=> ${r.data[0].quota} ,order reset`);
                    setTimeout(() => {
                        this.sql.query(`UPDATE sell_order set result = -1 ,up_time = '0000-00-00 00:00:00',err_info='库存不足' WHERE id = ${r.data[0].id}`);
                    }, 10 * 1000);
                }
            }
        }
    }
    async handler_outtime() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let sell_order_outtime = `UPDATE sell_order set result = -1 ,err_info='系统判断超时' WHERE result =2 and  unix_timestamp(NOW())-unix_timestamp(up_time) > 300`;
        let task_outtime = `UPDATE task set status = -1 ,err_info='系统判断超时' WHERE status =2 and  unix_timestamp(NOW())-unix_timestamp(up_time) > 300`;
        await this.sql.query(sell_order_outtime);
        await this.sql.query(task_outtime);
        let outtiemls = await this.sql.query(`SELECT * FROM zh WHERE balance_lock = 1 AND unix_timestamp(NOW())-unix_timestamp(lock_time) > 300`);
        if (outtiemls.length > 0) {
            for (let i = 0; i < outtiemls.length; i++) {
                await this.zh_ex.upquota('one', outtiemls[i]);
                await this.sql.query(`UPDATE zh SET lock_time = now(),balance_lock = 0 WHERE id = ${outtiemls[i].id}`);
                let r = this.sell_ex.killprocess(outtiemls[i].zh);
                if (r) {
                    common_1.Logger.log('Task =>' + `outtime process:${outtiemls[i].zh}  close success`);
                }
            }
        }
    }
    async top_order_outtime_reset() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let t1 = new Date().getTime();
        let r2 = await this.sql.query(`SELECT * FROM top_order WHERE result = 2 AND is_delete = 0 AND create_status = 1`);
        if (r2[0]) {
            for (let i = 0; i < r2.length; i++) {
                let yan = "";
                if (r2[i].merchant_id != '1') {
                    r2[i].merchant_id = r2[i].merchant_id.toString().replace ? r2[i].merchant_id.toString().replace(/ /g, '') : r2[i].merchant_id;
                    let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${r2[i].merchant_id}`);
                    if (tyan[0])
                        yan = `&key=${tyan[0].yan}`;
                }
                let t = {
                    merId: r2[i].merchant_id,
                    orderId: r2[i].tid,
                    nonceStr: this.utils.randomString(16)
                };
                let sign = this.api.ascesign(t, yan);
                t['sign'] = sign;
                let qres = await this.api.payquery(t);
            }
        }
        let outtime = await this.utils.getsetcache('order_outtime', 60);
        let arr = [
            `SET @uids := null;`,
            `UPDATE top_order SET result = -1,err_info = '支付超时' WHERE is_delete = 0 AND  result = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) > ${outtime}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) ;`,
            `SELECT * FROM top_order WHERE id IN (@uids) ;`,
        ];
        let r = await this.sql.transaction(arr);
        if (r.result && r.data[0]) {
            let data = r.data;
            common_1.Logger.log(`有超时订单,数量:${data.length}`);
            let resetls = [];
            for (let i = 0; i < data.length; i++) {
                resetls.push(`'${data[i].oid}'`);
            }
            await this.sql.query(`UPDATE paylink SET  merchant_id = 0 ,result = 0,tid=NULL WHERE is_delete = 0 AND channel = 1 AND  oid in (${resetls.join(',')})`);
        }
        let pay_link_unlock_time = await this.utils.getsetcache('pay_link_unlock_time', 60);
        let arr3 = [
            `SET @uids := null;`,
            `UPDATE paylink SET merchant_id = 0 ,result = 0,tid=NULL WHERE is_delete = 0 AND  channel = 1 AND create_status = 1 AND  result = 2 AND unix_timestamp(NOW())-unix_timestamp(lock_time) > ${pay_link_unlock_time}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) ;`,
        ];
        await this.sql.transaction(arr3);
    }
    async resetZhquota_temp() {
        await this.sql.query(`UPDATE zh SET quota_temp = 0 `);
    }
    async handler_toporder() {
        let task_open = await this.utils.getsetcache('task_open', 60);
        if (task_open != '1')
            return;
        let open = await this.utils.getsetcache('open', 60);
        if (Number(open) === 1 && this.utils.iscreate == false) {
            let r = await this.sql.query(`SELECT * FROM zhset WHERE mark LIKE '%面额%'`);
            let link_outtime = await this.utils.getsetcache('link_outtime', 60);
            await this.sql.query(`UPDATE paylink SET is_delete = 1 WHERE  result = 0 AND is_delete = 0 AND unix_timestamp(NOW())-unix_timestamp(create_time) > ${link_outtime};`);
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            for (let i = 0; i < r.length; i++) {
                let ak = await this.sql.query(`SELECT COUNT(*) AS count FROM paylink WHERE quota = ${Number(r[i].set_name) * 100} AND is_delete = 0 AND result = 0 AND zh is not null AND pay_link is not null AND channel = 1 AND    lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND create_status = 1`);
                if (ak[0].count < Number(r[i].set_value)) {
                    if (this.utils.nowprocess < this.utils.maxprocess) {
                        this.utils.iscreate = true;
                        let zhData = await this.sql.query(`select * FROM zh WHERE is_delete = 0 AND enable = 1 AND quota >=5000 AND quota-quota_temp >= 5000 AND balance_lock = 0 AND zh not in (SELECT zh FROM paylink WHERE channel = 1 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400) ORDER BY RAND() LIMIT 1`);
                        if (zhData[0]) {
                            let subprocess = this.top_ex.create(zhData[0], Number(r[i].set_name) * 100, 1, -1, true);
                            if (!subprocess) {
                                this.utils.iscreate = false;
                            }
                        }
                        else {
                            this.utils.iscreate = false;
                        }
                        break;
                    }
                    else {
                        this.utils.iscreate = false;
                    }
                }
            }
        }
        else {
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('* * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "vx_top_order_handler", null);
__decorate([
    (0, schedule_1.Cron)('* * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "sell_order_task", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handler_outtime", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "top_order_outtime_reset", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_5AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "resetZhquota_temp", null);
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handler_toporder", null);
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof sell_EX_1.SellEXService !== "undefined" && sell_EX_1.SellEXService) === "function" ? _b : Object, typeof (_c = typeof top_EX_1.TopEXService !== "undefined" && top_EX_1.TopEXService) === "function" ? _c : Object, typeof (_d = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _d : Object, typeof (_e = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _e : Object, typeof (_f = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _f : Object, typeof (_g = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _g : Object])
], TasksService);
exports.TasksService = TasksService;


/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/schedule");

/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZhExecuteService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const TEMPPATH = (__webpack_require__(13).tempPath);
const REQ = __webpack_require__(26);
const h = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
};
let ZhExecuteService = class ZhExecuteService {
    constructor(sql) {
        this.sql = sql;
        this.zh_table = "zh";
    }
    async upquota(action, body) {
        if (action == 'all') {
            let z = await this.sql.query(`SELECT zh,cookie FROM zh`);
            for (let i = 0; i < z.length; i++) {
                let openid = z[i].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = z[i].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                await this.up(openid, openkey, z[i].zh);
            }
        }
        else {
            let z = await this.sql.query(`SELECT zh,cookie FROM zh WHERE id = ${body.id}`);
            if (z[0]) {
                let openid = z[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = z[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                await this.up(openid, openkey, z[0].zh);
            }
        }
    }
    async upbyzh(zh) {
        let z = await this.sql.query(`SELECT zh,cookie FROM zh WHERE zh = ${zh}`);
        if (z[0]) {
            let openid = z[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
            let openkey = z[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
            return await this.up(openid, openkey, z[0].zh);
        }
        return 0;
    }
    async checktranslist(openid, openkey, zh) {
        let url = 'https://api.unipay.qq.com/v1/r/1450000186/trade_record_query';
        let form = {
            CmdCode: 'query2',
            SubCmdCode: 'default',
            PageNum: '1',
            BeginUnixTime: '1635417724',
            EndUnixTime: parseInt((new Date().getTime() / 1000).toString()).toString(),
            PageSize: '100',
            SystemType: 'portal',
            pf: '__mds_default',
            pfkey: 'pfkey',
            from_h5: '1',
            webversion: 'MidasTradeRecord1.0',
            openid: openid,
            openkey: openkey,
            session_id: 'openid',
            session_type: 'kp_accesstoken',
        };
        let res = await REQ.post({ url: url, headers: h, form: form });
        try {
            let body = JSON.parse(res);
            if (res && body.msg === 'ok') {
                return res;
            }
        }
        catch (error) {
            common_1.Logger.error(`获取交易列表出错${error}`);
        }
        return false;
    }
    async up(openid, openkey, zh) {
        if (openid && openkey && zh) {
            common_1.Logger.log(`${zh}开始获取余额 . oid => ${openid} . okey => ${openkey}`);
            let upurl = `https://api.unipay.qq.com/v1/r/1450000186/wechat_query?cmd=4&pf=mds_storeopen_qb-__mds_default_-html5&pfkey=pfkey&from_h5=1&from_https=1&sandbox=&openid=${openid}&openkey=${openkey}&session_id=openid&session_type=kp_accesstoken&WxAppid=wx951bdcac522929b6&qq_appid=101502376&offerId=1450000186`;
            try {
                let res = await REQ.get({ url: upurl, resolveWithFullResponse: true, headers: h });
                if (res.statusCode === 200) {
                    let body = JSON.parse(res.body);
                    console.log(`${zh}余额${Number(body.qb_balance) / 100}`);
                    await this.sql.query(`UPDATE zh SET balance = ${body.qb_balance} WHERE zh = ${zh}`);
                    return body.qb_balance;
                }
            }
            catch (error) {
                common_1.Logger.error(`${zh}获取余额出错${JSON.stringify(error)}`);
            }
        }
        else {
            common_1.Logger.error(`${zh}获取余额出错`);
        }
        return 0;
    }
};
ZhExecuteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object])
], ZhExecuteService);
exports.ZhExecuteService = ZhExecuteService;


/***/ }),
/* 26 */
/***/ ((module) => {

"use strict";
module.exports = require("request-promise-native");

/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellEXService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
const zhexecute_service_1 = __webpack_require__(25);
const { spawn } = __webpack_require__(28);
const { scriptPath } = __webpack_require__(13);
let SellEXService = class SellEXService {
    constructor(sql, utils, zhEX, redis) {
        this.sql = sql;
        this.utils = utils;
        this.zhEX = zhEX;
        this.redis = redis;
        this.sell_order = 'sell_order';
        this.NOZH = -1;
        this.processLs = {};
    }
    async create(body, zh) {
        this.utils.nowprocess++;
        let args = [scriptPath,
            zh.zh,
            zh.cookie,
            `pay`,
            body.game_type,
            body.top_zh,
            body.quota,
            body.sellid,
            body.game_qu
        ];
        let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
        if (subchild) {
            this.processLs[zh.zh] = subchild;
            subchild.on("message", async (msg) => {
                console.log('监听子进程信息', msg);
                switch (msg.action) {
                    case 'busy':
                        await this.sql.query(` UPDATE zh SET lock_time =FROM_UNIXTIME( unix_timestamp(lock_time)+3600 ) WHERE   zh = '${msg.zh}'`);
                        await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 1 WHERE zh = '${msg.zh}'`);
                        await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='安全码繁忙' WHERE id =${msg.sellid}`);
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (this.killprocess(msg.zh)) {
                            this.utils.nowprocess--;
                            common_1.Logger.log('sell_EX =>' + `kill process success,AQ_code is busy , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case 'code':
                        let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                        if (c[0] && c[0].aq_code) {
                            await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                            subchild.send({ action: 'code', code: c[0].aq_code });
                        }
                        break;
                    case 'upcode':
                        let res = await this.sql.query(`INSERT INTO task(zh,up_time) VALUES('${msg.zh}',now())`);
                        common_1.Logger.log('sell_EX =>' + 'create aq_code task ,id:' + res.insertId);
                        subchild.send({ action: 'taskid', taskid: res.insertId });
                        break;
                    case 'pay':
                        common_1.Logger.log('sell_EX =>' + JSON.stringify(msg));
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (msg.result == '成功') {
                            common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} success `);
                            await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime `);
                            await this.zhEX.upbyzh(msg.zh);
                            let nowquota = await this.sql.query(`SELECT balance FROM zh WHERE zh = '${msg.zh}'`);
                            let order_before_quota = await this.sql.query(`SELECT before_quota FROM sell_order WHERE id = ${msg.sellid}`);
                            if (nowquota[0].balance != order_before_quota[0].before_quota) {
                                common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime but success `);
                                await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='回调超时' WHERE id =${msg.sellid}`);
                            }
                        }
                        else {
                            await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} ,balance_lock = 0 WHERE zh = '${msg.zh}'`);
                        }
                        if (this.killprocess(msg.zh)) {
                            this.utils.nowprocess--;
                            common_1.Logger.log('sell_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case "check":
                        if (msg.result == '成功') {
                            await this.sql.query(`UPDATE zh SET enable = 1 WHERE zh = '${msg.zh}'`);
                        }
                        else {
                            await this.sql.query(`UPDATE zh SET enable = 0 WHERE zh = '${msg.zh}'`);
                        }
                        break;
                    default:
                        break;
                }
            });
            subchild.stdout.on("data", async (data) => {
                let islog = await this.utils.getsetcache('scriptlog', 60);
                if (islog == '1')
                    common_1.Logger.log('sell_EX =>' + data.toString());
            });
            subchild.stderr.on("data", (data) => {
                data = data.toString();
                common_1.Logger.error("error" + data);
            });
            subchild.on("exit", (code, signal) => {
                common_1.Logger.error('sell_EX =>' + `exit process -${code} - ${signal}`);
            });
            return subchild;
        }
        else {
            this.utils.nowprocess--;
        }
        return false;
    }
    async createProm(body, zh) {
        return await new Promise(async (resolve, reject) => {
            this.utils.nowprocess++;
            let args = [scriptPath,
                zh.zh,
                zh.cookie,
                `pay`,
                body.game_type,
                body.top_zh,
                body.quota,
                body.sellid,
                body.game_qu
            ];
            let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
            if (subchild) {
                this.processLs[zh.zh] = subchild;
                subchild.on("message", async (msg) => {
                    console.log('监听子进程信息', msg);
                    switch (msg.action) {
                        case 'busy':
                            await this.sql.query(` UPDATE zh SET lock_time =FROM_UNIXTIME( unix_timestamp(lock_time)+3600 ) WHERE   zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 1 WHERE zh = '${msg.zh}'`);
                            await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='安全码繁忙' WHERE id =${msg.sellid}`);
                            await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                            if (this.killprocess(msg.zh)) {
                                this.utils.nowprocess--;
                                common_1.Logger.log('sell_EX =>' + `kill process success,AQ_code is busy , nowprocess-- ${this.utils.nowprocess}`);
                            }
                            break;
                        case 'code':
                            let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                            if (c[0] && c[0].aq_code) {
                                await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                                subchild.send({ action: 'code', code: c[0].aq_code });
                            }
                            break;
                        case 'upcode':
                            let res = await this.sql.query(`INSERT INTO task(zh,up_time) VALUES('${msg.zh}',now())`);
                            common_1.Logger.log('sell_EX =>' + 'create aq_code task ,id:' + res.insertId);
                            subchild.send({ action: 'taskid', taskid: res.insertId });
                            break;
                        case 'pay':
                            common_1.Logger.log('sell_EX =>' + JSON.stringify(msg));
                            await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                            if (msg.result == '成功') {
                                common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} success `);
                                await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                            }
                            else if (msg.result == '超时') {
                                common_1.Logger.error(`${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime `);
                                await this.zhEX.upbyzh(msg.zh);
                                let nowquota = await this.sql.query(`SELECT balance FROM zh WHERE zh = '${msg.zh}'`);
                                let order_before_quota = await this.sql.query(`SELECT before_quota FROM sell_order WHERE id = ${msg.sellid}`);
                                if (nowquota[0].balance != order_before_quota[0].before_quota) {
                                    common_1.Logger.log('sell_EX =>' + `${msg.zh} help ${msg.top_zh} pay ${msg.quota} outtime but success `);
                                    await this.sql.query(`UPDATE zh SET balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                    await this.sql.query(`UPDATE sell_order SET result = 1 WHERE id =${msg.sellid}`);
                                }
                                else {
                                    await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} , balance_lock = 0 WHERE zh = '${msg.zh}'`);
                                    await this.sql.query(`UPDATE sell_order SET result = -1,err_info ='回调超时' WHERE id =${msg.sellid}`);
                                }
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET balance = balance + ${msg.quota * 100} ,balance_lock = 0 WHERE zh = '${msg.zh}'`);
                            }
                            if (this.killprocess(msg.zh)) {
                                this.utils.nowprocess--;
                                common_1.Logger.log('sell_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                            }
                            break;
                        case "check":
                            if (msg.result == '成功') {
                                await this.sql.query(`UPDATE zh SET enable = 1 WHERE zh = '${msg.zh}'`);
                            }
                            else {
                                await this.sql.query(`UPDATE zh SET enable = 0 WHERE zh = '${msg.zh}'`);
                            }
                            resolve(msg);
                            break;
                        default:
                            break;
                    }
                });
                subchild.stdout.on("data", async (data) => {
                    let islog = await this.utils.getsetcache('scriptlog', 60);
                    if (islog == '1')
                        common_1.Logger.log('sell_EX =>' + data.toString());
                });
                subchild.stderr.on("data", (data) => {
                    data = data.toString();
                    common_1.Logger.error("error" + data);
                });
                subchild.on("exit", (code, signal) => {
                    common_1.Logger.error('sell_EX =>' + `exit process -${code} - ${signal}`);
                });
            }
            else {
                this.utils.nowprocess--;
            }
        });
    }
    killprocess(zh) {
        if (this.processLs[zh]) {
            return this.processLs[zh].kill(2);
        }
        else {
            return false;
        }
    }
};
SellEXService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], SellEXService);
exports.SellEXService = SellEXService;


/***/ }),
/* 28 */
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),
/* 29 */
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopEXService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
const zhexecute_service_1 = __webpack_require__(25);
const { spawn } = __webpack_require__(28);
const { scriptPath } = __webpack_require__(13);
const REQ = __webpack_require__(26);
let TopEXService = class TopEXService {
    constructor(sql, utils, zhEX, redis) {
        this.sql = sql;
        this.utils = utils;
        this.zhEX = zhEX;
        this.redis = redis;
        this.sell_order = 'sell_order';
        this.top_order = 'top_order';
        this.NOZH = -1;
        this.processLs = {};
    }
    async create(zh, quota, channel, topid, isautocreate = false) {
        this.utils.nowprocess++;
        let args = [scriptPath,
            zh.zh,
            zh.cookie,
            `top`,
            quota / 100,
            channel,
            zh.zid,
            topid
        ];
        let isproxy = await this.utils.getsetcache('isproxy', 60);
        if (isproxy == '1') {
            let getproxyurl = await this.utils.getsetcachemark('isproxy', 60);
            try {
                let res = await REQ.get(getproxyurl);
                if (res && res.indexOf(":") != -1) {
                    common_1.Logger.log(`代理ip ${res}`);
                    let r = await REQ.get('http://www.baidu.com', { proxy: `http://${res}`, timeout: 3000 });
                    let proxyArray = res.split(":");
                    args.push(proxyArray[0]);
                    args.push(proxyArray[1]);
                }
                else {
                    common_1.Logger.error("获取代理失败");
                    if (isautocreate) {
                        this.utils.iscreate = false;
                    }
                    this.utils.nowprocess--;
                    return false;
                }
            }
            catch (error) {
                common_1.Logger.error("代理失败", error);
                if (isautocreate) {
                    this.utils.iscreate = false;
                }
                this.utils.nowprocess--;
                return false;
            }
        }
        common_1.Logger.log('top_EX =>' + `node ${args.join(' ')}`);
        let subchild = spawn("node", args, { stdio: [null, null, null, "ipc"] });
        if (subchild) {
            this.processLs[zh.zh] = subchild;
            subchild.on("message", async (msg) => {
                console.log('监听子进程信息', msg);
                switch (msg.action) {
                    case 'code':
                        let c = await this.sql.query(`SELECT id,aq_code FROM zh WHERE zh = '${msg.zh}' AND  unix_timestamp(NOW())-unix_timestamp(aq_code_last_up_time) < 30 AND aq_code_is_use = 0`);
                        if (c[0] && c[0].aq_code) {
                            await this.sql.query(`UPDATE zh SET aq_code_is_use = 1 WHERE id = ${c[0].id}`);
                            subchild.send({ action: 'code', code: c[0].aq_code });
                        }
                        break;
                    case 'upcode':
                        let res = await this.sql.query(`INSERT INTO task(zh) VALUES('${msg.zh}')`);
                        common_1.Logger.log('top_EX =>' + 'create aq_code task ,id:' + res.insertId);
                        subchild.send({ action: 'taskid', taskid: res.insertId });
                        break;
                    case 'top':
                        common_1.Logger.log('top_EX =>' + JSON.stringify(msg));
                        await this.sql.query(`UPDATE task SET status = 1 WHERE id = ${msg.insertId}`);
                        if (msg.result == '成功') {
                            common_1.Logger.log('top_EX =>' + `${msg.zh} create top_link success `);
                            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,lock_time) VALUES ('${msg.zh}',${Number(msg.quota) * 100},'${msg.pay_link}',0,now(),1,'${msg.oid}','${msg.zid}',FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}))`);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`'top_EX =>' + ${msg.zh} create ${msg.quota} top_link  outtime `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}')`);
                        }
                        else if (msg.result == '风险验证') {
                            common_1.Logger.error(`'top_EX =>' + ${msg.zh} create ${msg.quota} top_link  verifycode `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}')`);
                        }
                        if (this.killprocess(msg.zh)) {
                            if (isautocreate) {
                                this.utils.iscreate = false;
                            }
                            this.utils.nowprocess--;
                            common_1.Logger.log('top_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    case 'topVX':
                        common_1.Logger.log('top_EX topVX =>  ' + JSON.stringify(msg));
                        if (msg.result == '成功') {
                            common_1.Logger.log('top_EX topVX =>' + `${msg.zh} create topVX_link success `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,channel) VALUES ('${msg.zh}',${Number(msg.quota) * 100},'${msg.pay_link}',0,now(),1,'${msg.oid}','${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET zh = '${msg.zh}',pay_link = '${msg.pay_link}',oid = '${msg.oid}',zid = '${msg.zid}',create_status = 1 WHERE tid = '${msg.topid}'`);
                            this.redis.set(msg.topid, msg.pay_link, 90);
                        }
                        else if (msg.result == '超时') {
                            common_1.Logger.error(`'top_EX topVX=>' + ${msg.zh} create ${msg.quota} topVX_link  outtime `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid,channel) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET create_status = 0 WHERE tid = '${msg.topid}'`);
                        }
                        else if (msg.result == '风险验证') {
                            common_1.Logger.error(`'top_EX topVX=>' + ${msg.zh} create ${msg.quota} topVX_link  verifycode `);
                            await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,zid,channel) VALUES ('${msg.zh}',${msg.quota},'${msg.result}',1,now(),-1,'${msg.zid}',${msg.channel})`);
                            await this.sql.query(`UPDATE top_order SET create_status = 0 WHERE tid = '${msg.topid}'`);
                        }
                        if (this.killprocess(msg.zh)) {
                            if (isautocreate) {
                                this.utils.iscreate = false;
                            }
                            this.utils.nowprocess--;
                            common_1.Logger.log('top_EX =>' + `kill process success , nowprocess-- ${this.utils.nowprocess}`);
                        }
                        break;
                    default:
                        break;
                }
            });
            subchild.stdout.on("data", async (data) => {
                let islog = await this.utils.getsetcache('scriptlog', 60);
                if (islog == '1')
                    common_1.Logger.log('top_EX =>' + data.toString());
            });
            subchild.stderr.on("data", (data) => {
                data = data.toString();
                common_1.Logger.error("error" + data);
            });
            subchild.on("exit", (code, signal) => {
                common_1.Logger.error('top_EX =>' + `exit process -${code} - ${signal}`);
            });
            return subchild;
        }
        else {
            this.utils.nowprocess--;
        }
        return false;
    }
    killprocess(zh) {
        if (this.processLs[zh]) {
            return this.processLs[zh].kill(2);
        }
        else {
            return false;
        }
    }
};
TopEXService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _c : Object, typeof (_d = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _d : Object])
], TopEXService);
exports.TopEXService = TopEXService;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiService = void 0;
const common_1 = __webpack_require__(6);
const top_EX_1 = __webpack_require__(30);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
const fs = __webpack_require__(19);
const crypto = __webpack_require__(18);
const zhexecute_service_1 = __webpack_require__(25);
const fsp = __webpack_require__(32);
const fs_1 = __webpack_require__(19);
const path_1 = __webpack_require__(10);
var rep = '\\dist\\admin';
if (__dirname.indexOf('wwwroot') != -1) {
    rep = '/dist/admin';
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
else {
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
const keysPath = __dirname.replace(rep, '/keys/');
const REQ = __webpack_require__(26);
const host = (__webpack_require__(13).host);
let ApiService = class ApiService {
    constructor(utils, sql, zhEX, topEX, redis) {
        this.utils = utils;
        this.sql = sql;
        this.zhEX = zhEX;
        this.topEX = topEX;
        this.redis = redis;
        this.linktype = {
            1: 'q',
            2: 'v'
        };
    }
    async pay(body) {
        let { channel, merId, sign } = body;
        let payopen = await this.utils.getsetcache('pay_open', 60);
        if (payopen == '1') {
            if (sign.length == 32) {
                switch (channel) {
                    case '1':
                        return await this.payqq(body);
                    case '2':
                        return await this.payvx(body);
                    default:
                        break;
                }
            }
            else {
                switch (channel) {
                    case '1':
                        return await this.payqqRSA(body);
                    case '2':
                        return await this.payqqRSA(body);
                    default:
                        break;
                }
            }
        }
        else {
            return '暂时接单';
        }
    }
    ;
    async RSAverify(merId, localsign, sign) {
        try {
            let path = (0, path_1.join)(keysPath, `${merId}/public.pem`);
            await fsp.access(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
        }
        catch (_a) {
            throw new common_1.HttpException('商户文件不存在', 400);
        }
        let publickey = fs.readFileSync((0, path_1.join)(keysPath, `${merId}/public.pem`)).toString();
        let verify = this.utils.RSApublicVerify(publickey, Buffer.from(localsign), Buffer.from(sign.replace(/ /g, '+'), 'base64'));
        return verify;
    }
    async payqq(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}拉起qq链接  请求签名${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('额度不正确,订单只支持50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('测试模式动态生成支付金额');
                let r = await this.payauto(body);
                return r;
            }
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let arr = [
                `SET @uids := null;`,
                `UPDATE paylink SET  result = 2,merchant_id = ${body.merId},lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${pay_link_lock_time})  WHERE channel = 1 AND  merchant_id=0 AND pay_link is not null AND oid is not null  AND  quota = ${q} AND result = 0 AND is_delete = 0 AND lock_time <= now() AND create_status = 1  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM paylink WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(arr);
            if (r.result && r.data[0]) {
                let { zh, pay_link, oid, zid, zhmark } = r.data[0];
                let { orderId, userId, ip, notifyUrl, orderAmt, channel } = body;
                let tid = this.utils.guid(this.linktype[channel], orderAmt.indexOf('.') > -1 ? orderAmt.split('.')[0] : orderAmt);
                await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zid,zhmark,channel) VALUES ('${tid}','${zh}',${q},${body.merId},'${pay_link}',2,'${oid}','${orderId}','${userId}','${ip}','${notifyUrl}','${zid}','${zhmark}',1)`);
                await this.redis.set(tid, pay_link, 180);
                return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
            }
            else {
                throw new common_1.HttpException('无符合链接', 400);
            }
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payvx(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}拉起vx动态链接  请求签名${body.sign}`);
        if (localsign === body.sign) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('额度不正确,订单只支持1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payqqRSA(body) {
        common_1.Logger.log(body);
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}拉起qqRSA链接  请求签名${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            let model = await this.utils.getsetcache('testmodel', 60);
            if (model != '1') {
                if (q != 5000 && q != 10000 && q != 20000) {
                    throw new common_1.HttpException('额度不正确,订单只支持50 100 200', 400);
                }
            }
            else if (q != 5000 && q != 10000 && q != 20000 && q != 30000 && q != 50000) {
                common_1.Logger.log('测试模式动态生成支付金额');
                let r = await this.payauto(body);
                return r;
            }
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let arr = [
                `SET @uids := null;`,
                `UPDATE paylink SET  result = 2,merchant_id = ${body.merId},lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${pay_link_lock_time})  WHERE channel = 1 AND create_status = 1 AND  merchant_id=0 AND pay_link is not null AND oid is not null  AND  quota = ${q} AND result = 0 AND is_delete = 0 AND lock_time <= now()  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM paylink WHERE id IN (@uids);`,
            ];
            let r = await this.sql.transaction(arr);
            if (r.result && r.data[0]) {
                let { zh, pay_link, oid, zid, zhmark } = r.data[0];
                let { orderId, userId, ip, notifyUrl, orderAmt, channel } = body;
                let tid = this.utils.guid(this.linktype[channel], orderAmt);
                await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zid,zhmark,channel) VALUES ('${tid}','${zh}',${q},${body.merId},'${pay_link}',2,'${oid}','${orderId}','${userId}','${ip}','${notifyUrl}','${zid}','${zhmark}',1)`);
                await this.redis.set(tid, pay_link, 180);
                return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
            }
            else {
                throw new common_1.HttpException('无符合链接', 400);
            }
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payvxRSA(body) {
        let { merId } = body;
        let localsign = this.ascesign(body, '');
        common_1.Logger.log(`${localsign}   ${merId}拉起vxRSA动态链接  请求签名${body.sign}`);
        let verify = false;
        verify = await this.RSAverify(merId, localsign, body.sign);
        if (verify) {
            let q = Number(body.orderAmt) * 100;
            if (q != 100 && q != 10000 && q != 20000 && q != 30000 && q != 40000 && q != 50000) {
                throw new common_1.HttpException('额度不正确,订单只支持1 100 200 300 400 500', 400);
            }
            let r = await this.payauto(body);
            return r;
        }
        throw new common_1.HttpException('校验错误', 400);
    }
    async payauto(body) {
        let q = Number(body.orderAmt) * 100;
        let vx_bock_time = await this.utils.getsetcache('vx_bock_time', 120);
        let arr = [
            `SET @uids := null;`,
            `UPDATE zh SET  balance_lock = 1 ,lock_time = FROM_UNIXTIME(unix_timestamp(now())+ ${vx_bock_time})
         WHERE is_delete = 0 AND enable = 1 AND quota >=${q} AND quota-quota_temp >= ${q} AND balance_lock = 0 
         AND zh not in (SELECT zh FROM paylink WHERE channel = 2 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids))   LIMIT 1;`,
            `SELECT * FROM zh WHERE id IN (@uids);`,
        ];
        let zhData = await this.sql.transaction(arr);
        if (zhData.data[0]) {
            let { zh, zid, zhmark } = zhData.data[0];
            let { orderId, userId, ip, notifyUrl, channel, orderAmt } = body;
            let tid = this.utils.guid(this.linktype[channel], orderAmt.indexOf('.') > -1 ? orderAmt.split('.')[0] : orderAmt);
            let insertId = await this.sql.query(`INSERT ignore INTO top_order(tid,zh,zid,quota,merchant_id	,result,mer_orderId,mer_userId,mer_ip,mer_notifyUrl,zhmark,channel,create_status ) VALUES ('${tid}','${zh}','${zid}',${q},${body.merId},2,'${orderId}','${userId}','${ip}','${notifyUrl}','${zhmark ? zhmark : ''}',${channel},2)`);
            await this.redis.set(tid, '0', 180);
            let subprocess = await this.topEX.create(zhData.data[0], q, channel, tid);
            return { code: 1, payurl: `${host}/pay.html?no=${tid}`, sysorderno: tid, orderno: orderId };
        }
        else {
            throw new common_1.HttpException('无符合链接', 400);
        }
    }
    ;
    async payquery(body) {
        let { merId } = body;
        let yan = '';
        if (merId != '1') {
            merId = merId.replace ? merId.replace(/ /g, '') : merId;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        let localsign = this.ascesign(body, yan);
        common_1.Logger.log(`${localsign}   ${merId}查询订单  请求签名${body.sign}`);
        if (localsign === body.sign) {
            common_1.Logger.log("查询开始");
            let r = await this.sql.query(`SELECT * FROM top_order WHERE  tid = '${body.orderId}'`);
            if (!r[0]) {
                return '查询出错,订单号错误';
            }
            else {
                if (r[0].result == 1) {
                    let res = { merId: body.merId, status: 1, orderId: r[0].mer_orderId, sysOrderId: r[0].tid, orderAmt: r[0].quota, nonceStr: this.utils.randomString(16) };
                    let sign = this.ascesign(res, yan);
                    res['sign'] = sign;
                    return res;
                }
            }
            let zh = await this.sql.query(`SELECT * FROM zh WHERE zh = '${r[0].zh}'`);
            if (zh[0]) {
                let openid = zh[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
                let openkey = zh[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
                let translist = await this.zhEX.checktranslist(openid, openkey, r[0].zh);
                let ispay = 0;
                if (translist.indexOf(r[0].oid) > -1) {
                    let arr = [
                        `UPDATE top_order SET result = 1,err_info='支付到账' WHERE tid = '${body.orderId}'`,
                        `UPDATE paylink AS a JOIN (SELECT top_order.oid FROM top_order WHERE tid = '${body.orderId}')b ON a.oid = b.oid  SET result = 1,tid = '${body.orderId}'  `
                    ];
                    await this.sql.transaction(arr);
                    ispay = 1;
                    let tNotify = {
                        merId: r[0].merchant_id,
                        orderId: r[0].mer_orderId,
                        sysOrderId: r[0].tid,
                        desc: 'no',
                        orderAmt: (Number(r[0].quota) / 100).toString(),
                        status: ispay.toString(),
                        nonceStr: this.utils.randomString(16),
                        attch: '1'
                    };
                    if (r[0].merchant_id == '6') {
                        common_1.Logger.log(r[0]);
                        common_1.Logger.log(tNotify);
                    }
                    this.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
                }
                let res = { merId: body.merId, status: ispay, orderId: r[0].mer_orderId, sysOrderId: r[0].tid, orderAmt: r[0].quota / 100, nonceStr: this.utils.randomString(16) };
                let sign = this.ascesign(res, yan);
                res['sign'] = sign;
                return res;
            }
            return 'ok';
        }
        return '校验错误';
    }
    ;
    async notifyRequest(url, notify, yan) {
        let sign = this.ascesign(notify, yan);
        let form = JSON.stringify(notify);
        form = JSON.parse(form);
        form['sign'] = sign;
        common_1.Logger.log(form);
        try {
            let r = await REQ.post({ url: url, form: form });
            if (r && r === 'success') {
                try {
                    await this.sql.query(`UPDATE top_order SET call_back_info = '通知成功' WHERE tid = '${notify.sysOrderId}'`);
                }
                catch (error) {
                    common_1.Logger.error(`${notify.sysOrderId}更新回调状态: 成功 .出错`);
                }
            }
            common_1.Logger.log(`${url}回调通知成功${r}`);
        }
        catch (error) {
            try {
                await this.sql.query(`UPDATE top_order SET call_back_info = '通知失败' WHERE tid = '${notify.sysOrderId}'`);
            }
            catch (error) {
                common_1.Logger.error(`${notify.sysOrderId}更新回调状态 : 失败 . 出错`);
            }
            common_1.Logger.error(`${url}回调通知失败 ${JSON.stringify(error)}`);
        }
    }
    async getpayurl(body) {
        let { orderid, channel } = body;
        orderid = orderid.replace(/ /g, '').toLocaleLowerCase();
        let order_info = await this.redis.get(orderid);
        let code = 1, msg = '', url = '';
        if (!order_info) {
            code = 3;
            msg = "订单超时,请重新拉取";
        }
        else if (order_info == '0') {
            code = 2;
        }
        else if (order_info.indexOf('/') > -1) {
            code = 0;
            msg = "马上点击支付";
            url = order_info;
        }
        return { code, msg, url };
    }
    ascesign(obj, yan) {
        let newData2 = {}, signData2 = [];
        Object.keys(obj).sort().map(key => {
            newData2[key] = obj[key];
            if (key != 'sign') {
                signData2.push(`${key}=${obj[key]}`);
            }
        });
        let sign = this.utils.md5(signData2.join('&') + yan).toLocaleUpperCase();
        return sign;
    }
    async testreset() {
        await this.sql.query(`UPDATE paylink SET merchant_id = 0 ,result = 0,tid=NULL,lock_time = now();`);
        return 'ok';
    }
    async getonecreate(b, user) {
        console.log(b, 'getonecreate', user);
        if (!user)
            throw new common_1.HttpException('请先登录', 401);
        let { action } = b;
        let result = null;
        switch (action) {
            case 'getzh':
                let sqlstr = `select * FROM zh WHERE is_delete = 0 AND enable = 1 
    AND quota >=5000 AND quota-quota_temp >= 5000 
    AND balance_lock = 0 AND zh not in (SELECT zh FROM paylink WHERE channel = 1 AND unix_timestamp(NOW())-unix_timestamp(create_time) < 86400) 
    ORDER BY RAND() LIMIT 1`;
                let r = await this.sql.query(sqlstr);
                if (r[0])
                    result = r[0];
                return result;
            case 'savelink':
                console.log(b);
                let msg = b;
                let zh = await this.sql.query(`select * from zh where zh = '${msg.zh}'`);
                if (zh[0]) {
                    msg.zid = zh[0].zid;
                }
                else {
                    throw new common_1.HttpException('账号不存在', 404);
                }
                let buff = Buffer.from(msg.pay_link, 'base64');
                const str = buff.toString('utf-8');
                let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
                await this.sql.query(`INSERT INTO paylink(zh,quota,pay_link,result,up_time,create_status,oid,zid,lock_time) VALUES ('${msg.zh}',${msg.quota},'${str}',0,now(),1,'${msg.oid}','${msg.zid}',FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}))`);
                return 'ok';
            default:
                break;
        }
    }
};
ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _a : Object, typeof (_b = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _b : Object, typeof (_c = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _c : Object, typeof (_d = typeof top_EX_1.TopEXService !== "undefined" && top_EX_1.TopEXService) === "function" ? _d : Object, typeof (_e = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _e : Object])
], ApiService);
exports.ApiService = ApiService;


/***/ }),
/* 32 */
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(34);
const auth_controller_1 = __webpack_require__(36);
const passport_1 = __webpack_require__(37);
const local_strategy_1 = __webpack_require__(40);
const jwt_1 = __webpack_require__(35);
const constants_1 = __webpack_require__(42);
const jwt_strategy_1 = __webpack_require__(43);
const expiresInTime = (__webpack_require__(13).jwt.expiresInTime);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: expiresInTime },
            }),
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(35);
const mysql_service_1 = __webpack_require__(12);
const utils_service_1 = __webpack_require__(17);
let AuthService = class AuthService {
    constructor(jwtService, utils, sql) {
        this.jwtService = jwtService;
        this.utils = utils;
        this.sql = sql;
    }
    async validateUser(username, pass) {
        const user = await this.sql.query(`SELECT * FROM adminuser WHERE username = '${username}'`);
        if (user[0] && user[0].password === pass) {
            return user[0];
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.username,
            uid: user.id,
            roles: user.roles,
        };
        if (user.roles == 'admin') {
            return {
                token: this.jwtService.sign(payload),
                tokenHead: 'Bearer ',
                username: user.username,
                id: user.id,
                roles: user.roles,
            };
        }
        else {
            return {
                token: this.jwtService.sign(payload),
                tokenHead: 'Bearer ',
            };
        }
    }
    jwtDecode(token) {
        return this.jwtService.decode(token.split(' ')[1]);
    }
    jwtDecodeByQuery(token) {
        return this.jwtService.decode(token);
    }
    async userlogin(query) {
        let { username, password } = query;
        username = username.replace(/ /g, '');
        password = password.replace(/ /g, '').toLocaleUpperCase();
        const user = await this.sql.query(`SELECT * FROM user WHERE username = '${username}'`);
        if (user[0] && user[0].password === password) {
            const payload = {
                username: user[0].username,
                uid: user[0].id,
                roles: user[0].roles,
            };
            return {
                token: this.jwtService.sign(payload)
            };
        }
        return null;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _c : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 35 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.AuthController = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(37);
const auth_service_1 = __webpack_require__(34);
const auth_dto_1 = __webpack_require__(38);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async logout(req) {
        return 'ok';
    }
    async userlogin(query) {
        return this.authService.userlogin(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('/user/login'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_dto_1.User !== "undefined" && auth_dto_1.User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userlogin", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),
/* 37 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const class_validator_1 = __webpack_require__(39);
class User {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.MinLength)(3, { message: '用户名长度不能少于3位' }),
    (0, class_validator_1.MaxLength)(10, { message: '用户名最长10位' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '密码不能为空' }),
    (0, class_validator_1.MinLength)(32, { message: '密码长度不能少于6位' }),
    (0, class_validator_1.MaxLength)(32, { message: '密码最长10位' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
exports.User = User;


/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_local_1 = __webpack_require__(41);
const passport_1 = __webpack_require__(37);
const common_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(34);
const core_1 = __webpack_require__(4);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService, moduleRef) {
        super({
            passReqToCallback: true,
        });
        this.authService = authService;
        this.moduleRef = moduleRef;
    }
    async validate(headers, username, password) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new common_1.HttpException('账号密码错误', 400);
        }
        return user;
    }
};
LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof core_1.ModuleRef !== "undefined" && core_1.ModuleRef) === "function" ? _b : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 41 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConstants = void 0;
const jwtSecret = (__webpack_require__(13).jwt.jwtSecret);
exports.jwtConstants = {
    secret: jwtSecret,
};


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_jwt_1 = __webpack_require__(44);
const passport_1 = __webpack_require__(37);
const common_1 = __webpack_require__(6);
const constants_1 = __webpack_require__(42);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
    }
    async validate(payload) {
        return {
            uid: payload.uid,
            username: payload.username,
            roles: payload.roles,
        };
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),
/* 44 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(6);
const admin_service_1 = __webpack_require__(46);
const admin_controller_1 = __webpack_require__(47);
const user_service_1 = __webpack_require__(54);
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, user_service_1.UserService]
    })
], AdminModule);
exports.AdminModule = AdminModule;


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const utils_service_1 = __webpack_require__(17);
const path_1 = __webpack_require__(10);
const fsp = __webpack_require__(32);
const redis_service_1 = __webpack_require__(15);
var rep = '\\dist\\admin';
if (__dirname.indexOf('wwwroot') != -1) {
    rep = '/dist/admin';
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
else {
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
const tempPath = __dirname.replace(rep, '/public/temp/');
let AdminService = class AdminService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async info(user) {
        if (user.roles == 'selluser' || user.rolese == 'topuser') {
            common_1.Logger.error(`${user.username}请求登录后台,id:${user.uid}`);
            throw new common_1.HttpException('账号密码错误', 400);
        }
        else {
            let roles = await this.sql.query(`SELECT roles FROM adminuser WHERE id = ${user.uid}`);
            if (roles[0].roles == 'user') {
                var roleslist = await this.sql.query(`SELECT menuslist FROM role WHERE name = '${roles[0].roles}'`);
                var menus = await this.sql.query(`SELECT * FROM menus WHERE id in (${roleslist[0].menuslist})`);
            }
            return {
                icon: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg',
                menus: menus,
                roles: roles[0].roles,
                username: user.username,
            };
        }
    }
    async list() {
        let result = await this.sql.query(`SELECT username,createTime,note FROM adminuser WHERE is_delete = 0`);
        return result;
    }
    async statictotal() {
        let result = null;
        let statictotal = await this.redis.get('statictotal');
        if (statictotal) {
            result = JSON.parse(statictotal);
        }
        else {
            let ztotal = await this.sql.query(`SELECT COUNT(*) AS total,SUM(balance) AS toptotal FROM zh WHERE is_delete =0 `);
            let pay_link_lock_time = await this.utils.getsetcache('pay_link_lock_time', 120);
            let stocklinktotal = await this.sql.query(`SELECT COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND create_status = 1;`);
            let linktotal = await this.sql.query(`SELECT COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND  lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND create_status = 1;`);
            let stocklinktotalclass = await this.sql.query(`SELECT quota,COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND create_status = 1 GROUP BY quota ;`);
            let linktotalclass = await this.sql.query(`SELECT quota,COUNT(*) AS total FROM paylink WHERE is_delete =0 AND result != 1 AND channel = 1 AND  lock_time < FROM_UNIXTIME(unix_timestamp(now()) - ${pay_link_lock_time}) AND create_status = 1 GROUP BY quota;`);
            let toptodaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  top_order WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND result = 1 AND channel = 1`);
            let topyesterdaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  top_order WHERE TO_DAYS(NOW()) - TO_DAYS(create_time) = 1 AND result = 1 AND channel = 1`);
            let paytodaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  sell_order WHERE TO_DAYS(create_time) = TO_DAYS(NOW()) AND result = 1 `);
            let payyesterdaytotal = await this.sql.query(`SELECT COUNT(*) AS total ,SUM(quota) AS quotatotal FROM  sell_order WHERE TO_DAYS(NOW()) - TO_DAYS(create_time) = 1 AND result = 1 `);
            result = {
                zhtotal: ztotal[0].total,
                toptotal: ztotal[0].toptotal,
                topordertodaytotal: toptodaytotal[0].total,
                toptodaytotal: toptodaytotal[0].quotatotal,
                toporderyesterdaytotal: topyesterdaytotal[0].total,
                topyesterdaytotal: topyesterdaytotal[0].quotatotal,
                payordertodaytotal: paytodaytotal[0].total,
                paytodaytotal: paytodaytotal[0].quotatotal,
                payorderyesterdaytotal: payyesterdaytotal[0].total,
                payyesterdaytotal: payyesterdaytotal[0].quotatotal,
                linktotalclass: linktotalclass,
                linktotal: linktotal[0].total,
                stocklinktotal: stocklinktotal[0].total,
                stocklinktotalclass
            };
            await this.redis.set('statictotal', JSON.stringify(result), 30);
        }
        return result;
    }
    async create(body) {
        await this.sql.query(`INSERT INTO adminuser(username,password,note,nickname) VALUES('${body.username}','${this.utils.md5(body.password)}','${body.note}','${body.nickname}')`);
        return 'ok';
    }
    async up(body) {
        await this.sql.query(`UPDATE adminuser SET password = '${this.utils.md5(body.new)}' WHERE username = '${body.selectUser.username}'`);
        return 'ok';
    }
    async deluser(body) {
        if (body.username != 'admin') {
            await this.sql.query(`UPDATE adminuser SET is_delete = 1 WHERE username = '${body.username}'`);
        }
        else {
            throw new common_1.HttpException('超级管理员账号不能删除', 400);
        }
    }
    async repass(body, user) {
        console.log('修改密码', body, user);
        let r = await this.sql.query(`SELECT * FROM adminuser WHERE id = ${user.uid}`);
        if (r[0]) {
            let userinfo = r[0];
            if (userinfo.password == this.utils.md5(body.old) &&
                body.new === body.new1) {
                let md5pass = this.utils.md5(body.new);
                await this.sql.query(`UPDATE adminuser SET password = '${md5pass}' WHERE id = ${user.uid}`);
                return 'ok';
            }
            else {
                throw new common_1.HttpException({ message: '旧密码错误' }, 400);
            }
        }
        throw new common_1.HttpException({ message: '服务器出错' }, 400);
    }
    async upfilename(file) {
        common_1.Logger.log(file.mimetype);
        if ((file.mimetype != 'text/plain') && (file.mimetype != 'text/csv')) {
            throw new common_1.HttpException('请上存txt/csv格式文件', 400);
        }
        let filename = this.utils.randomString(20);
        let filepath = (0, path_1.join)(tempPath, `${filename}.txt`);
        await fsp.writeFile(filepath, file.buffer);
        return { filename: filename + '.txt' };
    }
    async setting(body) {
        let { action, data } = body;
        switch (action) {
            case 'get':
                let r = await this.sql.query(`SELECT * FROM zhset `);
                r.forEach(e => {
                    e.edit = false;
                });
                return r;
                break;
            case 'save':
                common_1.Logger.log(JSON.stringify(data));
                let { set_value, set_name, id, mark } = data;
                if (id > 0) {
                    await this.sql.query(`UPDATE zhset SET set_value = '${set_value}',set_name = '${set_name}',mark = '${mark}' WHERE id = ${id}`);
                }
                else {
                    await this.sql.query(`INSERT INTO zhset(set_value,set_name,mark) VALUES('${set_value}','${set_name}','${mark}')`);
                }
                await this.redis.set(set_name, set_value, 60);
                break;
            case 'del':
                await this.sql.query(`DELETE FROM zhset WHERE id = ${data.id}`);
            default:
                break;
        }
        return 'ok';
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], AdminService);
exports.AdminService = AdminService;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(37);
const platform_express_1 = __webpack_require__(48);
const roles_decorator_1 = __webpack_require__(49);
const role_enum_1 = __webpack_require__(50);
const validation_pipe_1 = __webpack_require__(51);
const admin_service_1 = __webpack_require__(46);
const admin_dto_1 = __webpack_require__(53);
const user_service_1 = __webpack_require__(54);
let AdminController = class AdminController {
    constructor(adminService, userService) {
        this.adminService = adminService;
        this.userService = userService;
    }
    async info(req) {
        return this.adminService.info(req.user);
    }
    async list() {
        return this.adminService.list();
    }
    async statictotal() {
        return this.adminService.statictotal();
    }
    async create(body) {
        return this.adminService.create(body);
    }
    async delete(body) {
        console.log('删除', body);
        return this.adminService.deluser(body);
    }
    async up(body) {
        return this.adminService.up(body);
    }
    async repass(body, req) {
        return this.adminService.repass(body, req.user);
    }
    async upfilename(file) {
        return this.adminService.upfilename(file);
    }
    async setting(body) {
        return this.adminService.setting(body);
    }
    async findAll(query) {
        return this.userService.findAll(query);
    }
    async createuser(body) {
        return this.userService.createuser(body);
    }
    async topuserupdate(body) {
        return this.userService.topuserupdate(body);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('info'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "info", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('statictotal'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "statictotal", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('create'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_dto_1.Admin !== "undefined" && admin_dto_1.Admin) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('delete'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('up'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "up", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('repass'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "repass", null);
__decorate([
    (0, common_1.Post)('/upfilename'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "upfilename", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('setting'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof admin_dto_1.Setting !== "undefined" && admin_dto_1.Setting) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setting", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('topuserlist'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('topusercreate'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createuser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('topuserupdate'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "topuserupdate", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [typeof (_e = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _e : Object, typeof (_f = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _f : Object])
], AdminController);
exports.AdminController = AdminController;


/***/ }),
/* 48 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(6);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Admin"] = "admin";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationPipe = void 0;
const common_1 = __webpack_require__(6);
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(39);
let ValidationPipe = class ValidationPipe {
    async transform(value, { metatype }) {
        console.log('进入全局管道');
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            let arr = Object.keys(errors[0].constraints);
            let errormsg = errors.shift().constraints[arr[0]];
            throw new common_1.BadRequestException(errormsg);
        }
        return value;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
exports.ValidationPipe = ValidationPipe;


/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Setting = exports.StaticTotal = exports.Admin = void 0;
const class_validator_1 = __webpack_require__(39);
class Admin {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.MinLength)(6, { message: '用户名长度不能少于6位' }),
    __metadata("design:type", String)
], Admin.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.MinLength)(1, { message: '昵称最少长度1位' }),
    (0, class_validator_1.MaxLength)(10, { message: '昵称最大长度10位' }),
    __metadata("design:type", String)
], Admin.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户名不能为空' }),
    (0, class_validator_1.MinLength)(6, { message: '密码长度不能少于6位' }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
exports.Admin = Admin;
class StaticTotal {
}
exports.StaticTotal = StaticTotal;
class Setting {
}
exports.Setting = Setting;


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const utils_service_1 = __webpack_require__(17);
const path_1 = __webpack_require__(10);
const fsp = __webpack_require__(32);
const fs_1 = __webpack_require__(19);
const redis_service_1 = __webpack_require__(15);
var rep = '\\dist\\admin';
if (__dirname.indexOf('wwwroot') != -1) {
    rep = '/dist/admin';
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
else {
    if (__dirname.indexOf('admin') == -1) {
        rep = 'dist';
    }
}
const keysPath = __dirname.replace(rep, '/keys/');
let UserService = class UserService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async findAll(params) {
        let { keyword, pageNum, pageSize } = params;
        let total = await this.sql.query(`SELECT count(1) AS count FROM user WHERE username LIKE '%${keyword ? keyword : ''}%' `);
        let r = await this.sql.query(`SELECT * FROM user WHERE username LIKE '%${keyword ? keyword : ''}%' 
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            quotatotal: total[0].quotatotal,
            list: r,
        };
    }
    async createuser(body) {
        let { nickName } = body;
        try {
            let username = this.utils.randomString(8);
            let password = this.utils.randomString(8);
            let salt = this.utils.randomString(8);
            let r = await this.sql.query(`INSERT INTO user (username,password,yan,nickName,status,note,email,icon,roles) VALUES ('${username}','${this.utils.md5(password)}','${salt}','${nickName}',1,'','','','top')`);
            let path = (0, path_1.join)(keysPath, `${r.insertId}`);
            await fsp.mkdir(path);
            this.utils.RSAcreateKeyPairFile(path, '');
            common_1.Logger.log(`用户${username}创建成功,密码为${password},盐为${salt}`);
        }
        catch (error) {
            common_1.Logger.error(error);
        }
        return 'ok';
    }
    async topuserupdate(body) {
        let { action, data } = body;
        switch (action) {
            case 'delete':
                await this.sql.query(`DELETE FROM user WHERE id=${data.id}`);
                let path = (0, path_1.join)(keysPath, `${data.id}`);
                try {
                    await fsp.access(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
                    await fsp.rmdir(path, { recursive: true });
                }
                catch (_a) {
                    console.error('cannot access');
                }
                break;
            case 'downkeys':
                let path1 = (0, path_1.join)(keysPath, `${data.id}`);
                try {
                    await fsp.access(path1, fs_1.constants.R_OK | fs_1.constants.W_OK);
                    let publickey = await fsp.readFile((0, path_1.join)(path1, 'public.pem'), 'utf8');
                    let privatekey = await fsp.readFile((0, path_1.join)(path1, 'private.pem'), 'utf8');
                    let keys = publickey + '\r\n' + privatekey;
                    return keys;
                }
                catch (_b) {
                    throw new common_1.HttpException('秘钥文件不存在', 400);
                }
            case 'updatepass':
                let { id, password } = data;
                await this.sql.query(`UPDATE user SET password='${this.utils.md5(password)}' WHERE id=${id}`);
                break;
            default:
                break;
        }
        return 'ok';
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], UserService);
exports.UserService = UserService;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScriptModule = void 0;
const common_1 = __webpack_require__(6);
const script_service_1 = __webpack_require__(56);
const script_controller_1 = __webpack_require__(57);
let ScriptModule = class ScriptModule {
};
ScriptModule = __decorate([
    (0, common_1.Module)({
        controllers: [script_controller_1.ScriptController],
        providers: [script_service_1.ScriptService]
    })
], ScriptModule);
exports.ScriptModule = ScriptModule;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScriptService = void 0;
const common_1 = __webpack_require__(6);
let ScriptService = class ScriptService {
};
ScriptService = __decorate([
    (0, common_1.Injectable)()
], ScriptService);
exports.ScriptService = ScriptService;


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.ScriptController = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const script_service_1 = __webpack_require__(56);
let ScriptController = class ScriptController {
    constructor(scriptService, sql) {
        this.scriptService = scriptService;
        this.sql = sql;
    }
    async update(query) {
        let version = await this.sql.query(`select * from script_list where id=1`);
        let result = {
            "download_url": version[0].downurl,
            "version": version[0].version,
            "dialog": false,
            "msg": "优化部分问题",
            "force": true,
            "download_timeout": 180
        };
        return result;
    }
    async myupdate(query) {
        let version = await this.sql.query(`select * from script_list where id=1`);
        let result = {};
        if (query.version != version[0].version) {
            result = {
                "download_url": "http://192.168.3.222:3000/script/release.iec",
                "version": "1.0.1",
                "dialog": false,
                "msg": "优化部分问题",
                "force": true,
                "download_timeout": 180
            };
        }
        return result;
    }
    async config(query) {
        return {};
    }
};
__decorate([
    (0, common_1.Get)('/update'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/myupdate'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "myupdate", null);
__decorate([
    (0, common_1.Get)('/config'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "config", null);
ScriptController = __decorate([
    (0, common_1.Controller)('script'),
    __metadata("design:paramtypes", [typeof (_a = typeof script_service_1.ScriptService !== "undefined" && script_service_1.ScriptService) === "function" ? _a : Object, typeof (_b = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _b : Object])
], ScriptController);
exports.ScriptController = ScriptController;


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketModule = void 0;
const common_1 = __webpack_require__(6);
const socket_service_1 = __webpack_require__(59);
const socket_gateway_1 = __webpack_require__(60);
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    (0, common_1.Module)({
        providers: [socket_gateway_1.SocketGateway, socket_service_1.SocketService]
    })
], SocketModule);
exports.SocketModule = SocketModule;


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketService = void 0;
const common_1 = __webpack_require__(6);
let SocketService = class SocketService {
    create(createSocketDto) {
        return 'This action adds a new socket';
    }
    findAll() {
        return `This action returns all socket123`;
    }
    findOne(id) {
        return `This action returns a #${id} socket`;
    }
    update(id, updateSocketDto) {
        return `This action updates a #${id} socket`;
    }
    remove(id) {
        return `This action removes a #${id} socket`;
    }
};
SocketService = __decorate([
    (0, common_1.Injectable)()
], SocketService);
exports.SocketService = SocketService;


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketGateway = void 0;
const websockets_1 = __webpack_require__(61);
const socket_service_1 = __webpack_require__(59);
const create_socket_dto_1 = __webpack_require__(62);
const update_socket_dto_1 = __webpack_require__(63);
let SocketGateway = class SocketGateway {
    constructor(socketService) {
        this.socketService = socketService;
    }
    create(createSocketDto) {
        return this.socketService.create(createSocketDto);
    }
    findAll() {
        console.log("接收到findAll");
        return this.socketService.findAll();
    }
    findOne(id) {
        return this.socketService.findOne(id);
    }
    update(updateSocketDto) {
        return this.socketService.update(updateSocketDto.id, updateSocketDto);
    }
    remove(id) {
        return this.socketService.remove(id);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('createSocket'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_socket_dto_1.CreateSocketDto !== "undefined" && create_socket_dto_1.CreateSocketDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllSocket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneSocket'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateSocket'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof update_socket_dto_1.UpdateSocketDto !== "undefined" && update_socket_dto_1.UpdateSocketDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeSocket'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "remove", null);
SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_service_1.SocketService !== "undefined" && socket_service_1.SocketService) === "function" ? _c : Object])
], SocketGateway);
exports.SocketGateway = SocketGateway;


/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/websockets");

/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSocketDto = void 0;
class CreateSocketDto {
}
exports.CreateSocketDto = CreateSocketDto;


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateSocketDto = void 0;
const mapped_types_1 = __webpack_require__(64);
const create_socket_dto_1 = __webpack_require__(62);
class UpdateSocketDto extends (0, mapped_types_1.PartialType)(create_socket_dto_1.CreateSocketDto) {
}
exports.UpdateSocketDto = UpdateSocketDto;


/***/ }),
/* 64 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZhModule = void 0;
const common_1 = __webpack_require__(6);
const zh_service_1 = __webpack_require__(66);
const zh_controller_1 = __webpack_require__(67);
const zhexecute_service_1 = __webpack_require__(25);
const sell_EX_1 = __webpack_require__(27);
let ZhModule = class ZhModule {
};
ZhModule = __decorate([
    (0, common_1.Module)({
        controllers: [zh_controller_1.ZhController],
        providers: [zh_service_1.ZhService, zhexecute_service_1.ZhExecuteService, sell_EX_1.SellEXService]
    })
], ZhModule);
exports.ZhModule = ZhModule;


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZhService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const path_1 = __webpack_require__(10);
const fsp = __webpack_require__(32);
const zhexecute_service_1 = __webpack_require__(25);
const utils_service_1 = __webpack_require__(17);
const sell_EX_1 = __webpack_require__(27);
const TEMPPATH = (__webpack_require__(13).tempPath);
let ZhService = class ZhService {
    constructor(sql, ex, utils, sell_EX) {
        this.sql = sql;
        this.ex = ex;
        this.utils = utils;
        this.sell_EX = sell_EX;
        this.zh_table = "zh";
    }
    async create(body) {
        let fp = (0, path_1.join)(TEMPPATH, body.filenamelist[0].filename);
        let fd = await fsp.readFile(fp);
        let cookieArray = fd.toString().split('\r\n');
        let i = 0;
        let datasql = [], error = [];
        cookieArray.forEach(e => {
            i++;
            let zh = e.split('----');
            if (zh && zh[1]) {
                let zuid = this.utils.zhguid();
                datasql.push(`('${zh[0]}','${zh[1]}','${zuid}')`);
            }
            else {
                error.push(i);
            }
        });
        await this.sql.query(`INSERT ignore INTO ${this.zh_table}(zh,cookie,zid) VALUE ${datasql.join(',')}`);
        return error.length > 0 ? error : 'ok';
    }
    async findAll(params) {
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.zh_table} WHERE zh LIKE '%${params.keyword ? params.keyword : ''}%' AND is_delete = 0`);
        let r = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE zh LIKE '%${params.keyword ? params.keyword : ''}%' AND is_delete = 0  LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async up(body) {
        console.log(body);
        if (body.action == 'del') {
            let whosql = ``;
            if (body.list) {
                whosql = `id in (${body.list.join(',')})`;
            }
            else {
                whosql = `id = ${body.id}`;
            }
            await this.sql.query(`UPDATE ${this.zh_table} SET is_delete = 1 WHERE  ${whosql}`);
        }
        else if (body.action == 'quota') {
            let whosql = ``;
            if (body.list) {
                whosql = `id in (${body.list.join(',')})`;
            }
            else {
                whosql = `id = ${body.id}`;
            }
            console.log(`UPDATE ${this.zh_table} SET quota = ${Number(body.quota) * 100} WHERE  ${whosql}`);
            await this.sql.query(`UPDATE ${this.zh_table} SET quota = ${body.quota} WHERE  ${whosql}`);
        }
        else if (body.action == 'enable') {
            await this.sql.query(`UPDATE ${this.zh_table} SET enable = ${body.enable} WHERE id = ${body.id}`);
        }
        else if (body.action == 'cookie') {
            await this.sql.query(`UPDATE ${this.zh_table} SET cookie = ${body.cookie} WHERE id = ${body.id}`);
        }
        else if (body.action == 'upquotaall') {
            await this.ex.upquota('all', body);
        }
        else if (body.action == 'upquota') {
            await this.ex.upquota('upquota', body);
        }
        return 'ok';
    }
    async checkzh() {
        this.checkzhScript();
        return 'ok';
    }
    async checkzhScript() {
        let zh = await this.sql.query(`SELECT * FROM ${this.zh_table} WHERE is_delete = 0 `);
        for (let i = 0; i < zh.length; i++) {
            await this.sell_EX.createProm({
                top_zh: '1403984237',
                game_type: 'DNF',
                game_qu: '1',
                quota: 1,
                merchant_id: 999,
                sellid: 999999
            }, zh[i]);
        }
    }
    async gettask(query) {
        if (query.action == 'get') {
            let arr = [
                `SET @uids := null;`,
                `UPDATE task SET status =2 , device_id = '${query.device_id}' ${query.nick_name ? `,nick_name ='${query.nick_name}'` : ''}  WHERE isNull(device_id)  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
                `SELECT * FROM task WHERE id IN (@uids) ;`,
            ];
            let zh = await this.sql.transaction(arr);
            return zh.data[0] ? zh.data[0] : 'no';
        }
        else if (query.action = 'check') {
            let s = await this.sql.query(`SELECT * FROM task WHERE id = ${query.id}`);
            return s[0] ? s[0] : { status: 2 };
        }
    }
    async checktask(query) {
        if (query.action == 'outtime') {
            await this.sql.query(`UPDATE task SET status = -2 WHERE id = ${query.id}`);
            return 'ok';
        }
        else if (query.action == 'check') {
            let s = await this.sql.query(`SELECT status FROM task WHERE id = ${query.id}`);
            return s[0];
        }
    }
    async upaqcode(query) {
        common_1.Logger.log(`${query.zh} aq_code:${query.code}`);
        await this.sql.query(`UPDATE zh SET aq_code = '${query.code}',aq_code_is_use = 0,aq_code_last_up_time	=now() WHERE zh = '${query.zh}'`);
        return 'ok';
    }
};
ZhService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _b : Object, typeof (_c = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _c : Object, typeof (_d = typeof sell_EX_1.SellEXService !== "undefined" && sell_EX_1.SellEXService) === "function" ? _d : Object])
], ZhService);
exports.ZhService = ZhService;


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const zh_service_1 = __webpack_require__(66);
const create_zh_dto_1 = __webpack_require__(68);
const passport_1 = __webpack_require__(37);
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


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZH = exports.QueryList = exports.ZhDtoList = exports.ZhDto = exports.UpFileDto = exports.CreateZhDto = void 0;
class CreateZhDto {
}
exports.CreateZhDto = CreateZhDto;
class UpFileDto {
}
exports.UpFileDto = UpFileDto;
class ZhDto {
}
exports.ZhDto = ZhDto;
class ZhDtoList {
}
exports.ZhDtoList = ZhDtoList;
class QueryList {
}
exports.QueryList = QueryList;
class ZH {
}
exports.ZH = ZH;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopOrderModule = void 0;
const common_1 = __webpack_require__(6);
const top_order_service_1 = __webpack_require__(70);
const top_order_controller_1 = __webpack_require__(71);
const top_EX_1 = __webpack_require__(30);
const zhexecute_service_1 = __webpack_require__(25);
const api_service_1 = __webpack_require__(31);
let TopOrderModule = class TopOrderModule {
};
TopOrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [top_order_controller_1.TopOrderController],
        providers: [top_order_service_1.TopOrderService, top_EX_1.TopEXService, zhexecute_service_1.ZhExecuteService, api_service_1.ApiService]
    })
], TopOrderModule);
exports.TopOrderModule = TopOrderModule;


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopOrderService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const zhexecute_service_1 = __webpack_require__(25);
const utils_service_1 = __webpack_require__(17);
const api_service_1 = __webpack_require__(31);
let TopOrderService = class TopOrderService {
    constructor(sql, zhEX, utils, api) {
        this.sql = sql;
        this.zhEX = zhEX;
        this.utils = utils;
        this.api = api;
        this.order_talbe = 'top_order';
        this.NOZH = -1;
        this.linktype = {
            1: 'QQ'
        };
    }
    async create(body, user) {
        let arr = [
            `SET @uids := null;`,
            `UPDATE zh SET quota_temp = quota_temp + ${body.quota}  WHERE enable = 1 AND is_delete = 0 AND quota - quota_temp > ${body.quota}  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
            `SELECT * FROM zh WHERE id IN (@uids) ;`,
        ];
        let zh = await this.sql.transaction(arr);
        let failsql = ``;
        let code = 0;
        if (zh.result && zh.data[0]) {
            let zhData = zh.data[0];
            failsql = `UPDATE zh SET quota_temp = quota_temp - ${body.quota} WHERE id = ${zhData.id}`;
            console.log(zhData);
        }
        else {
            code = this.NOZH;
        }
        return { code };
    }
    async findAll(params) {
        let { zid, keyword, pageNum, pageSize, queryType, zhmark, dateArray, channel, merchant_id } = params;
        let zidsql = '';
        if (zid) {
            zidsql = ` AND zid LIKE '%${zid}%'`;
        }
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let zhmarksql = '';
        if (zhmark) {
            zhmarksql = ` AND zhmark LIKE '%${zhmarksql}%'`;
        }
        let channelsql = '';
        if (channel) {
            channelsql = ` AND channel = ${channel}`;
        }
        let merchantidsql = '';
        if (merchant_id) {
            merchantidsql = ` AND merchant_id = ${merchant_id}`;
        }
        let createsql = '';
        if (dateArray) {
            createsql = ` AND unix_timestamp(create_time) > unix_timestamp('${this.utils.dayjsDate(dateArray[0]).format('YYYY-MM-DD HH:mm:ss')}') AND unix_timestamp(create_time) <= unix_timestamp('${this.utils.dayjsDate(dateArray[1]).format('YYYY-MM-DD HH:mm:ss')}')`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count,SUM(quota) AS quotatotal FROM ${this.order_talbe} WHERE zh LIKE '%${keyword ? keyword : ''}%' ${zidsql} ${queryTypesql} ${zhmarksql} ${createsql} ${channelsql} ${merchantidsql}`);
        let r = await this.sql.query(`SELECT * FROM ${this.order_talbe} WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%' or mer_orderId LIKE '%${keyword ? keyword : ''}%')
      ${zidsql}
      ${queryTypesql}
      ${zhmarksql}
      ${createsql}
      ${channelsql}
      ${merchantidsql}
       ORDER BY create_time DESC
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            quotatotal: total[0].quotatotal,
            list: r,
        };
    }
    async getlink(query, user) {
        let q = Number(query.quota) * 100;
        if (q != 5000 && q != 10000 && q != 20000) {
            return { code: -2, msg: "额度不正确,订单只支持50 100 200" };
        }
        let arr = [
            `SET @uids := null;`,
            `UPDATE paylink SET  result = 2,merchant_id = ${user.uid},lock_time =  date_format(now() + 900,'%Y-%m-%d %H:%i:%s')  WHERE  merchant_id=0 AND pay_link is not null  AND  quota = ${Number(query.quota) * 100} AND result = 0 AND is_delete = 0 AND lock_time <= now()  AND  ( SELECT @uids := CONCAT_WS(',', id, @uids)) LIMIT 1 ;`,
            `SELECT * FROM paylink WHERE id IN (@uids) ;`,
        ];
        common_1.Logger.log(arr);
        let r = await this.sql.transaction(arr);
        if (r.result && r.data[0]) {
            let { zh, pay_link, link_type, oid } = r.data[0];
            let uid = this.utils.guid('q', query.quota);
            common_1.Logger.log(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid) VALUES ('${uid}','${zh}',${q},${user.uid},'${pay_link}',2,'${oid}')`);
            await this.sql.query(`INSERT ignore INTO top_order(tid,zh,quota,merchant_id	,pay_link,result,oid) VALUES ('${uid}','${zh}',${q},${user.uid},'${pay_link}',2,'${oid}')`);
            return { code: 1, pay_link, tid: uid };
        }
        else {
            return { code: -1, msg: "无符合链接" };
        }
    }
    async checkorder(query, user) {
        if (!query.tid) {
            new common_1.HttpException('tid不能为空', 400);
        }
        let meridsql = '';
        if (user.roles != 'admin') {
            meridsql = ` AND merchant_id = ${user.uid}`;
        }
        let r = await this.sql.query(`SELECT * FROM top_order WHERE  tid = '${query.tid}' ${meridsql}`);
        if (!r[0]) {
            new common_1.HttpException('查询出错,tid错误', 400);
        }
        let yan = '', merId;
        if (r[0].merchant_id != '1') {
            merId = r[0].merchant_id;
            let tyan = await this.sql.query(`SELECT yan FROM user WHERE id = ${merId}`);
            if (tyan[0])
                yan = `&key=${tyan[0].yan}`;
        }
        if (query.action == '2') {
            let tNotify = {
                merId: r[0].merchant_id,
                orderId: r[0].mer_orderId,
                sysOrderId: r[0].tid,
                desc: 'no',
                orderAmt: (r[0].quota / 100).toString(),
                status: '1',
                nonceStr: this.utils.randomString(16),
                attch: '1'
            };
            await this.api.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
            await this.sql.query(`UPDATE paylink SET result = -1, create_status = -1 WHERE oid = '${r[0].oid}'`);
            return 'ok';
        }
        else {
            if (r[0].result == 1) {
                return { code: 1, msg: "成功到账" };
            }
        }
        let zh = await this.sql.query(`SELECT * FROM zh WHERE zh = '${r[0].zh}'`);
        if (zh[0]) {
            let openid = zh[0].cookie.match(/midas_txcz_openid=([a-z,A-Z,0-9]+)/)[1];
            let openkey = zh[0].cookie.match(/midas_txcz_openkey=([a-z,A-Z,0-9]+)/)[1];
            let translist = await this.zhEX.checktranslist(openid, openkey, r[0].zh);
            if (translist.indexOf(r[0].oid) > -1) {
                let arr = [
                    `UPDATE top_order SET result = 1,err_info='支付到账' WHERE tid = '${query.tid}'`,
                    `UPDATE paylink AS a JOIN (SELECT top_order.oid FROM top_order WHERE tid = '${query.tid}')b ON a.oid = b.oid  SET result = 1,tid = '${query.tid}'  `
                ];
                await this.sql.transaction(arr);
                let ispay = 1;
                let tNotify = {
                    merId: r[0].merchant_id,
                    orderId: r[0].mer_orderId,
                    sysOrderId: r[0].tid,
                    desc: 'no',
                    orderAmt: (r[0].quota / 100).toString(),
                    status: ispay.toString(),
                    nonceStr: this.utils.randomString(16),
                    attch: '1'
                };
                this.api.notifyRequest(r[0].mer_notifyUrl, tNotify, yan);
                return { code: 1, msg: "成功到账,订单状态已更改" };
            }
            return { code: 0, msg: "尚未到账" };
        }
        return { code: -1, msg: "服务器出错" };
    }
    findOne(id) {
        return `This action returns a #${id} topOrder`;
    }
    update(id, updateTopOrderDto) {
        return `This action updates a #${id} topOrder`;
    }
    remove(id) {
        return `This action removes a #${id} topOrder`;
    }
};
TopOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof zhexecute_service_1.ZhExecuteService !== "undefined" && zhexecute_service_1.ZhExecuteService) === "function" ? _b : Object, typeof (_c = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _c : Object, typeof (_d = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _d : Object])
], TopOrderService);
exports.TopOrderService = TopOrderService;


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopOrderController = void 0;
const common_1 = __webpack_require__(6);
const top_order_service_1 = __webpack_require__(70);
const top_order_dto_1 = __webpack_require__(72);
const passport_1 = __webpack_require__(37);
let TopOrderController = class TopOrderController {
    constructor(topOrderService) {
        this.topOrderService = topOrderService;
    }
    async create(createTopOrderDto, req) {
        return await this.topOrderService.create(createTopOrderDto, req.user);
    }
    async findAll(query) {
        return await this.topOrderService.findAll(query);
    }
    async getlink(query, req) {
        return await this.topOrderService.getlink(query, req.user);
    }
    async checkorder(query, req) {
        return await this.topOrderService.checkorder(query, req.user);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof top_order_dto_1.TopOrder !== "undefined" && top_order_dto_1.TopOrder) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof top_order_dto_1.QueryList !== "undefined" && top_order_dto_1.QueryList) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('getlink'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "getlink", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('checkorder'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TopOrderController.prototype, "checkorder", null);
TopOrderController = __decorate([
    (0, common_1.Controller)('top-order'),
    __metadata("design:paramtypes", [typeof (_c = typeof top_order_service_1.TopOrderService !== "undefined" && top_order_service_1.TopOrderService) === "function" ? _c : Object])
], TopOrderController);
exports.TopOrderController = TopOrderController;


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopOrder = exports.QueryList = void 0;
class QueryList {
}
exports.QueryList = QueryList;
class TopOrder {
}
exports.TopOrder = TopOrder;


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellOrderModule = void 0;
const common_1 = __webpack_require__(6);
const sell_order_service_1 = __webpack_require__(74);
const sell_order_controller_1 = __webpack_require__(75);
const sell_EX_1 = __webpack_require__(27);
const zhexecute_service_1 = __webpack_require__(25);
let SellOrderModule = class SellOrderModule {
};
SellOrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [sell_order_controller_1.SellOrderController],
        providers: [sell_order_service_1.SellOrderService, sell_EX_1.SellEXService, zhexecute_service_1.ZhExecuteService]
    })
], SellOrderModule);
exports.SellOrderModule = SellOrderModule;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellOrderService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const sell_EX_1 = __webpack_require__(27);
let SellOrderService = class SellOrderService {
    constructor(sql, ex) {
        this.sql = sql;
        this.ex = ex;
        this.sell_order = 'sell_order';
        this.NOZH = -1;
    }
    async create(body, user) {
        common_1.Logger.log(`创建充值订单请求 ${JSON.stringify(body)}`);
        let r = await this.sql.query(`INSERT INTO sell_order(top_zh,quota,game_type,game_qu,merchant_id,up_time) VALUES ('${body.top_zh}',${Number(body.quota) * 100},'${body.game_type}','${body.game_qu}',${body.merchant_id},now())`);
        return { order_id: r.insertId ? r.insertId : -1 };
    }
    async findAll(params) {
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.sell_order} WHERE (pay_zh LIKE '%${params.keyword ? params.keyword : ''}%' or top_zh LIKE '%${params.keyword ? params.keyword : ''}%') `);
        let r = await this.sql.query(`SELECT * FROM ${this.sell_order} WHERE (pay_zh LIKE '%${params.keyword ? params.keyword : ''}%' or top_zh LIKE '%${params.keyword ? params.keyword : ''}%') ORDER BY create_time DESC LIMIT ${(params.pageNum - 1) * params.pageSize},${params.pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async orderresult(query) {
        let r = await this.sql.query(`SELECT id,result,pay_zh,top_zh,err_info FROM sell_order WHERE id = ${query.id}`);
        let result = { result: r[0] ? r[0].result : '无该订单', err_info: r[0] ? r[0].err_info : '' };
        if (r[0] && r[0].result == 1) {
            result = r[0];
            result['downurl'] = `http://z.yyeth.top/sell/${r[0].pay_zh}/${r[0].id}-${r[0].top_zh}.png`;
            delete result['pay_zh'];
        }
        return result;
    }
};
SellOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof sell_EX_1.SellEXService !== "undefined" && sell_EX_1.SellEXService) === "function" ? _b : Object])
], SellOrderService);
exports.SellOrderService = SellOrderService;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellOrderController = void 0;
const common_1 = __webpack_require__(6);
const sell_order_service_1 = __webpack_require__(74);
const create_sell_order_dto_1 = __webpack_require__(76);
const passport_1 = __webpack_require__(37);
let SellOrderController = class SellOrderController {
    constructor(sellOrderService) {
        this.sellOrderService = sellOrderService;
    }
    async create(createSellOrderDto, req) {
        return await this.sellOrderService.create(createSellOrderDto, req.user);
    }
    async findAll(qeury) {
        return await this.sellOrderService.findAll(qeury);
    }
    async orderresult(query) {
        return await this.sellOrderService.orderresult(query);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_sell_order_dto_1.SellOrder !== "undefined" && create_sell_order_dto_1.SellOrder) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_sell_order_dto_1.QueryList !== "undefined" && create_sell_order_dto_1.QueryList) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('orderresult'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellOrderController.prototype, "orderresult", null);
SellOrderController = __decorate([
    (0, common_1.Controller)('sell-order'),
    __metadata("design:paramtypes", [typeof (_c = typeof sell_order_service_1.SellOrderService !== "undefined" && sell_order_service_1.SellOrderService) === "function" ? _c : Object])
], SellOrderController);
exports.SellOrderController = SellOrderController;


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellOrder = exports.QueryList = exports.CreateSellOrderDto = void 0;
class CreateSellOrderDto {
}
exports.CreateSellOrderDto = CreateSellOrderDto;
class QueryList {
}
exports.QueryList = QueryList;
class SellOrder {
}
exports.SellOrder = SellOrder;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiModule = void 0;
const common_1 = __webpack_require__(6);
const api_service_1 = __webpack_require__(31);
const api_controller_1 = __webpack_require__(78);
const zhexecute_service_1 = __webpack_require__(25);
const user_service_1 = __webpack_require__(81);
const top_EX_1 = __webpack_require__(30);
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    (0, common_1.Module)({
        controllers: [api_controller_1.ApiController],
        providers: [api_service_1.ApiService, zhexecute_service_1.ZhExecuteService, user_service_1.UserService, top_EX_1.TopEXService]
    })
], ApiModule);
exports.ApiModule = ApiModule;


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiController = void 0;
const api_service_1 = __webpack_require__(31);
const common_1 = __webpack_require__(6);
const validation_pipe_1 = __webpack_require__(51);
const api_dto_1 = __webpack_require__(79);
const user_service_1 = __webpack_require__(81);
const passport_1 = __webpack_require__(37);
let ApiController = class ApiController {
    constructor(apiService, user) {
        this.apiService = apiService;
        this.user = user;
    }
    async pay(body) {
        return await this.apiService.pay(body);
    }
    async payquery(body) {
        return await this.apiService.payquery(body);
    }
    async testreset() {
        return await this.apiService.testreset();
    }
    async update(query, req) {
        return await this.user.update(query, req.user);
    }
    async getOneCreate(body, req) {
        return await this.apiService.getonecreate(body, req.user);
    }
    async getpayurl(body) {
        return await this.apiService.getpayurl(body);
    }
};
__decorate([
    (0, common_1.Post)('pay'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pay", null);
__decorate([
    (0, common_1.Post)('/pay/query'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "payquery", null);
__decorate([
    (0, common_1.Get)('/testreset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "testreset", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/user/update'),
    __param(0, (0, common_1.Query)(new validation_pipe_1.ValidationPipe())),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof api_dto_1.UserAction !== "undefined" && api_dto_1.UserAction) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('getonecreate'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getOneCreate", null);
__decorate([
    (0, common_1.Post)('getpayurl'),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof api_dto_1.GetPayUrl !== "undefined" && api_dto_1.GetPayUrl) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getpayurl", null);
ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [typeof (_c = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _d : Object])
], ApiController);
exports.ApiController = ApiController;


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserAction = exports.Notify = exports.PayQuery = exports.GetPayUrl = exports.Pay = void 0;
const swagger_1 = __webpack_require__(80);
const class_validator_1 = __webpack_require__(39);
class Pay {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '商户号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "merId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '交易金额',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '交易金额不能为空' }),
    __metadata("design:type", Object)
], Pay.prototype, "orderAmt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通道类型',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通道类型不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单描述',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单描述不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "desc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '附加信息',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '附加信息不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "attch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '扫码模式',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '扫码模式不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "smstyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '用户编号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '用户编号不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '下单ip地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '下单ip地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通知地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通知地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "notifyUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '页面跳转地址',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '页面跳转地址不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "returnUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '随机字符串',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '随机字符串不能为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '随机字符串最长32位' }),
    __metadata("design:type", String)
], Pay.prototype, "nonceStr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '签名',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '签名不能为空' }),
    __metadata("design:type", String)
], Pay.prototype, "sign", void 0);
exports.Pay = Pay;
class GetPayUrl {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不等为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '订单号最长32位' }),
    __metadata("design:type", String)
], GetPayUrl.prototype, "orderid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '通道类型',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '通道类型不能为空' }),
    (0, class_validator_1.MaxLength)(1, { message: '通道类型最长1位' }),
    __metadata("design:type", String)
], GetPayUrl.prototype, "channel", void 0);
exports.GetPayUrl = GetPayUrl;
class PayQuery {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '商户号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "merId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '订单号',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '随机字符串',
        required: true,
    }),
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '随机字符串不能为空' }),
    (0, class_validator_1.MaxLength)(32, { message: '随机字符串最长32位' }),
    __metadata("design:type", String)
], PayQuery.prototype, "nonceStr", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '签名不能为空' }),
    __metadata("design:type", String)
], PayQuery.prototype, "sign", void 0);
exports.PayQuery = PayQuery;
class Notify {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: '商户号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "merId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '交易金额不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "orderAmt", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '我方系统单号不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "sysOrderId", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '系统描述不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "desc", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '订单状态：1为支付成功 不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null], { message: '附加信息不能为空' }),
    __metadata("design:type", String)
], Notify.prototype, "attch", void 0);
exports.Notify = Notify;
class UserAction {
}
__decorate([
    (0, class_validator_1.IsNotIn)(['', undefined, null, NaN], { message: 'action不能为空' }),
    __metadata("design:type", String)
], UserAction.prototype, "action", void 0);
exports.UserAction = UserAction;


/***/ }),
/* 80 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const utils_service_1 = __webpack_require__(17);
const REQ = __webpack_require__(26);
let UserService = class UserService {
    constructor(utils, sql) {
        this.utils = utils;
        this.sql = sql;
    }
    async update(query, user) {
        common_1.Logger.log(user);
        let { uid, roles, username } = user;
        let { action } = query;
        switch (action) {
            case 'getyan':
                let y = await this.sql.query(`SELECT yan FROM user WHERE id = ${uid}`);
                if (y[0]) {
                    return {
                        yan: y[0].yan
                    };
                }
                new common_1.HttpException('服务器出错', 400);
                break;
            case 'updateyan':
                let newyan = query.new.replace(/ /g, '');
                await this.sql.query(`UPDATE user SET yan = '${newyan}' WHERE id = ${uid}`);
                break;
            default:
                break;
        }
        return 'ok';
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _a : Object, typeof (_b = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _b : Object])
], UserService);
exports.UserService = UserService;


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayLinkModule = void 0;
const common_1 = __webpack_require__(6);
const pay_link_service_1 = __webpack_require__(83);
const pay_link_controller_1 = __webpack_require__(84);
let PayLinkModule = class PayLinkModule {
};
PayLinkModule = __decorate([
    (0, common_1.Module)({
        controllers: [pay_link_controller_1.PayLinkController],
        providers: [pay_link_service_1.PayLinkService]
    })
], PayLinkModule);
exports.PayLinkModule = PayLinkModule;


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayLinkService = void 0;
const common_1 = __webpack_require__(6);
const TEMPPATH = (__webpack_require__(13).tempPath);
const path_1 = __webpack_require__(10);
const fsp = __webpack_require__(32);
const mysql_service_1 = __webpack_require__(12);
let PayLinkService = class PayLinkService {
    constructor(sql) {
        this.sql = sql;
        this.mtable = 'paylink';
    }
    async createbyfile(body, user) {
        let fp = (0, path_1.join)(TEMPPATH, body.filenamelist[0].filename);
        common_1.Logger.log(fp);
        let fd = await fsp.readFile(fp);
        let linkArray = fd.toString().split('\r\n');
        let datasql = [];
        let errls = [];
        for (let i = 0; i < linkArray.length; i++) {
            try {
                let zh = linkArray[i].split('----');
                if (zh && zh[1]) {
                    let zid = await this.sql.query(`SELECT zid,mark FROM zh WHERE zh = '${zh[0]}'`);
                    if (zid[0]) {
                        datasql.push(`('${zh[0]}',${Number(zh[1]) * 100},'${zh[2]}','${zh[3]}',1,'${zid[0].zid}','${zid[0].mark}','')`);
                    }
                    else {
                        errls.push(i + 1);
                        common_1.Logger.error(`${zh[0]}无法获取zid ,插入链接失败,${JSON.stringify(errls)}`);
                    }
                }
            }
            catch (error) {
                errls.push(i + 1);
                common_1.Logger.error(`第 ${i + 1} 行插入链接失败,${JSON.stringify(errls)}`);
            }
        }
        if (datasql.length > 0) {
            await this.sql.query(`INSERT ignore INTO paylink(zh,quota,oid,pay_link,create_status,zid,zhmark,lock_time) VALUES ${datasql.join(',')}`);
        }
        common_1.Logger.log(errls.length);
        return { errls };
    }
    async findAll(params) {
        let { keyword, pageNum, pageSize, queryType } = params;
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM ${this.mtable} WHERE zh LIKE '%${keyword ? keyword : ''}%'${queryTypesql}  AND is_delete = 0 `);
        let r = await this.sql.query(`SELECT * FROM ${this.mtable} WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%')
      ${queryTypesql}
       AND is_delete = 0
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
    async getonecreate(query) {
        return 'ok';
    }
};
PayLinkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object])
], PayLinkService);
exports.PayLinkService = PayLinkService;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.PayLinkController = void 0;
const common_1 = __webpack_require__(6);
const pay_link_service_1 = __webpack_require__(83);
const create_pay_link_dto_1 = __webpack_require__(85);
const passport_1 = __webpack_require__(37);
let PayLinkController = class PayLinkController {
    constructor(payLinkService) {
        this.payLinkService = payLinkService;
    }
    async createbyfile(body, req) {
        return await this.payLinkService.createbyfile(body, req.user);
    }
    async findAll(query) {
        return await this.payLinkService.findAll(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('createbyfile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PayLinkController.prototype, "createbyfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_pay_link_dto_1.QueryList !== "undefined" && create_pay_link_dto_1.QueryList) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PayLinkController.prototype, "findAll", null);
PayLinkController = __decorate([
    (0, common_1.Controller)('pay-link'),
    __metadata("design:paramtypes", [typeof (_b = typeof pay_link_service_1.PayLinkService !== "undefined" && pay_link_service_1.PayLinkService) === "function" ? _b : Object])
], PayLinkController);
exports.PayLinkController = PayLinkController;


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryList = exports.CreatePayLinkDto = void 0;
class CreatePayLinkDto {
}
exports.CreatePayLinkDto = CreatePayLinkDto;
class QueryList {
}
exports.QueryList = QueryList;


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(87);
const users_controller_1 = __webpack_require__(88);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService]
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(6);
const mysql_service_1 = __webpack_require__(12);
const redis_service_1 = __webpack_require__(15);
const utils_service_1 = __webpack_require__(17);
let UsersService = class UsersService {
    constructor(sql, utils, redis) {
        this.sql = sql;
        this.utils = utils;
        this.redis = redis;
    }
    async findAll(params) {
        let { keyword, pageNum, pageSize, queryType } = params;
        let queryTypesql = '';
        if (queryType) {
            queryTypesql = ` AND result = ${queryType}`;
        }
        let total = await this.sql.query(`SELECT count(1) AS count FROM adminuser WHERE zh LIKE '%${keyword ? keyword : ''}%'${queryTypesql}  AND is_delete = 0 `);
        let r = await this.sql.query(`SELECT * FROM adminuser WHERE (tid LIKE '%${keyword ? keyword : ''}%' or oid LIKE '%${keyword ? keyword : ''}%')
      ${queryTypesql}
       AND is_delete = 0
      LIMIT ${(pageNum - 1) * pageSize},${pageSize}`);
        return {
            total: total[0].count,
            list: r,
        };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mysql_service_1.MysqlService !== "undefined" && mysql_service_1.MysqlService) === "function" ? _a : Object, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(87);
const passport_1 = __webpack_require__(37);
const role_enum_1 = __webpack_require__(50);
const roles_decorator_1 = __webpack_require__(49);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(query) {
        return this.usersService.findAll(query);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('userlist'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(6);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.log('进入全局异常过滤器...', exception);
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message || null;
        let msgLog = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: '请求失败',
            data: message,
        };
        let t = new Date();
        common_1.Logger.error(`${request.headers['x-forwarded-for']} 在 ${t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()}发起错误请求 请求路径: ${msgLog.path}`);
        if (request.url.toString().indexOf('/api') > -1) {
            let msgLogPay = {
                Code: status,
                timestamp: parseInt((new Date().getTime() / 1000).toString()),
                path: request.url,
                msg: message.indexOf('no such file or directory') > -1 ? '请求出错' : message,
                data: message.indexOf('no such file or directory') > -1 ? '请求出错' : message,
            };
            response.status(status).json(msgLogPay);
        }
        else {
            let msgLogV2 = {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: status == 500 ? '请求失败' : message,
                data: status == 500 ? '请求失败' : message,
            };
            response.status(status).json(msgLogV2);
        }
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XMLMiddleware = void 0;
const common_1 = __webpack_require__(6);
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


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(6);
const core_1 = __webpack_require__(4);
const roles_decorator_1 = __webpack_require__(49);
const auth_service_1 = __webpack_require__(34);
let JwtAuthGuard = class JwtAuthGuard {
    constructor(reflector, auth) {
        this.reflector = reflector;
        this.auth = auth;
        this.urlList = ['/auth/login', '/', '/user', '/example/getlist', '/example/transaction', '/script/update', '/script/myupdate', '/script/config', '/admin/upfilename',
            "/top-order/create", "/sell-order/create", "/zh/gettask", "/zh/checktask", '/zh/upaqcode', '/sell-order/orderresult', '/api/pay', '/api/pay/query', '/auth/user/login', '/api/user/update', '/api/getpayurl', '/api/getonecreate', '/zh/checkzh'];
    }
    canActivate(context) {
        const { url, query } = context.switchToHttp().getRequest();
        var request = context.switchToHttp().getRequest();
        if (this.hasUrl(this.urlList, url)) {
            if (url.indexOf('/api/user/update') > -1) {
                if (query && query.token) {
                    request.headers['authorization'] = `Bearer ${query.token}`;
                }
            }
            if (url.indexOf('/api/getonecreate') > -1) {
                console.log("query", query);
                if (query && query.token) {
                    let user = this.auth.jwtDecode(query.token);
                    console.log(user);
                    request.user = user;
                    request.headers['authorization'] = `Bearer ${query.token}`;
                }
            }
            return true;
        }
        const token = context.switchToRpc().getData().headers.authorization;
        console.log('进入全局守卫访问地址:', url, "携带token", token);
        if (token) {
            try {
                let user = this.auth.jwtDecode(token);
                console.log("解析的user", user);
                const roles = this.reflector.get('roles', context.getHandler());
                const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
                console.log("接口需要roles:", roles, "用户roles:", user.roles);
                if (user.roles == 'admin' || !roles) {
                    return true;
                }
                else {
                    let flag = false;
                    roles.forEach(e => {
                        if (e == user.roles) {
                            flag = true;
                        }
                    });
                    console.log(flag);
                    if (!flag) {
                        throw new common_1.HttpException('没有权限', common_1.HttpStatus.UNAUTHORIZED);
                    }
                    else {
                        return true;
                    }
                }
            }
            catch (e) {
                throw new common_1.HttpException('没有授权访问,请先登录', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new common_1.HttpException('没有授权访问,请先登录', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    hasUrl(urlList, url) {
        if (url.indexOf('?') > 0) {
            url = url.split('?')[0];
        }
        let flag = false;
        if (urlList.indexOf(url) >= 0) {
            flag = true;
        }
        return flag;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseInterceptor = void 0;
const common_1 = __webpack_require__(6);
const operators_1 = __webpack_require__(93);
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        console.log('进入全局响应拦截...');
        return next.handle().pipe((0, operators_1.map)((data) => {
            console.log('全局响应拦截器方法返回内容后...');
            if (request.url.indexOf('/script/update') > -1) {
                return data;
            }
            else if (request.url.indexOf('/api') > -1) {
                return {
                    Code: 1,
                    code: data.code || data.code == 0 ? data.code : 1,
                    time: parseInt((new Date().getTime() / 1000).toString()),
                    data: data.data ? data.data : data,
                    msg: data.msg ? data.msg : " ",
                    url: data.url ? data.url : ''
                };
            }
            else {
                return {
                    statusCode: 200,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: '请求成功',
                    data: data,
                };
            }
        }));
    }
};
ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
exports.ResponseInterceptor = ResponseInterceptor;


/***/ }),
/* 93 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs/operators");

/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    corsOptions = { origin: "*", credentials: true };
    callback(null, corsOptions);
};
exports["default"] = corsOptionsDelegate;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("7b5be4711aef3c311f7f")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;