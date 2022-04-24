"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const local_strategy_1 = require("./strategy/local.strategy");
const jwt_1 = require("@nestjs/jwt");
const database_module_1 = require("../database/database.module");
const user_module_1 = require("../user/user.module");
const config_1 = require("@nestjs/config");
const jwtConfig_config_1 = require("../config/jwtConfig.config");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
const passport_1 = require("@nestjs/passport");
const enterprise_module_1 = require("../enterprise/enterprise.module");
const local_enterprise_strategy_1 = require("./strategy/local-enterprise.strategy");
const jwt_enterprise_strategy_1 = require("./strategy/jwt-enterprise.strategy");
const local_admin_strategy_1 = require("./strategy/local-admin.strategy");
const jwt_admin_strategy_1 = require("./strategy/jwt-admin.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(jwtConfig_config_1.default),
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.registerAsync({
                imports: [
                    config_1.ConfigModule.forFeature(jwtConfig_config_1.default)
                ],
                useFactory: (config) => {
                    return {
                        secret: config.secretKey,
                        signOptions: {
                            expiresIn: config.expiresIn
                        }
                    };
                },
                inject: [
                    jwtConfig_config_1.default.KEY
                ]
            }),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            enterprise_module_1.EnterpriseModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, local_enterprise_strategy_1.LocalEnterpriseStrategy, jwt_enterprise_strategy_1.JwtEnterpriseStrategy, local_admin_strategy_1.LocalAdminStrategy, jwt_admin_strategy_1.JwtAdminStrategy],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map