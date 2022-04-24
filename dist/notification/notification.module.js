"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const notification_gateway_1 = require("./notification.gateway");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwtConfig_config_1 = require("../config/jwtConfig.config");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [
                    config_1.ConfigModule.forFeature(jwtConfig_config_1.default)
                ],
                useFactory: (config) => {
                    return {
                        secret: config.secretKey,
                        signOptions: {
                            expiresIn: config.expiresIn
                        },
                        verifyOptions: {
                            ignoreExpiration: true
                        }
                    };
                },
                inject: [
                    jwtConfig_config_1.default.KEY
                ]
            }),
        ],
        providers: [notification_gateway_1.NotificationGateway],
        exports: [notification_gateway_1.NotificationGateway]
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map