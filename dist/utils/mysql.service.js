"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlService = void 0;
const common_1 = require("@nestjs/common");
const sqlconfig = require('../../config.json').sql;
var mysql = require('mysql');
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
//# sourceMappingURL=mysql.service.js.map