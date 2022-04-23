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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationGateway = class NotificationGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.mapDevice = new Map();
    }
    afterInit(server) {
    }
    handleConnection(client, ...args) {
        const token = client.handshake.auth.bearer;
        if (!token) {
            return;
        }
        this.jwtService.verifyAsync(token)
            .then((res) => {
            console.log("connected", res.id);
            this.mapDevice.set(res.id.toString(), client.id);
        })
            .catch((e) => {
            console.log(e);
            return;
        });
    }
    handleDisconnect(client) {
        const token = client.handshake.auth.bearer;
        if (!token) {
            return;
        }
        this.jwtService.verifyAsync(token)
            .then((res) => {
            console.log("disconnected", res.id);
            this.mapDevice.delete(res.id.toString());
        })
            .catch((e) => {
            console.log(e);
            return;
        });
    }
    handleMessage(client, payload) {
        return 'Hello world!';
    }
    sendNotificationToClient(enterpriseId, noti) {
        const socketId = this.mapDevice.get(enterpriseId.toString());
        if (!socketId) {
            return;
        }
        this.server.to(socketId).emit("noti", noti);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], NotificationGateway.prototype, "handleMessage", null);
NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, { cors: true }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationGateway);
exports.NotificationGateway = NotificationGateway;
//# sourceMappingURL=notification.gateway.js.map