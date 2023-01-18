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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_service_1 = require("./socket.service");
const create_socket_dto_1 = require("./dto/create-socket.dto");
const update_socket_dto_1 = require("./dto/update-socket.dto");
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
    __metadata("design:paramtypes", [create_socket_dto_1.CreateSocketDto]),
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
    __metadata("design:paramtypes", [update_socket_dto_1.UpdateSocketDto]),
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
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=socket.gateway.js.map