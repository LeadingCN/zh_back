"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgService = void 0;
const common_1 = require("@nestjs/common");
const tencentcloud = require('tencentcloud-sdk-nodejs');
const smsClient = tencentcloud.sms.v20210111.Client;
const client = new smsClient({
    credential: {
        secretId: 'AKIDgBSURAds30jEVXM1YvAMRK1UkmbCYfW8',
        secretKey: 'RcXFn6AzYu2vYw4wZw3uYyCD0Zw62kEX',
    },
    region: 'ap-guangzhou',
    profile: {
        signMethod: 'HmacSHA256',
        httpProfile: {
            reqMethod: 'POST',
            reqTimeout: 30,
            endpoint: 'sms.tencentcloudapi.com',
        },
    },
});
let MsgService = class MsgService {
    async sendMsg(code, phone) {
        const params = {
            SmsSdkAppId: '1400672925',
            SignName: '长沙九尾狐科技有限公司',
            TemplateId: '1389202',
            TemplateParamSet: [code],
            PhoneNumberSet: [phone],
            SessionContext: '',
            ExtendCode: '',
            SenderId: '',
        };
        return new Promise((resolve, reject) => {
            client.SendSms(params, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        }).catch((e) => {
            return { data: e, result: false };
        });
    }
};
MsgService = __decorate([
    (0, common_1.Injectable)()
], MsgService);
exports.MsgService = MsgService;
//# sourceMappingURL=msg.service.js.map