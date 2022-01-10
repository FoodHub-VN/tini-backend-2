import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";
import { ConfigModule, ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwtConfig.config";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { EnterpriseModule } from "../enterprise/enterprise.module";
import { LocalEnterpriseStrategy } from "./strategy/local-enterprise.strategy";
import { JwtEnterpriseStrategy } from "./strategy/jwt-enterprise.strategy";

@Module({
    imports: [
        ConfigModule.forFeature(jwtConfig),
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            imports: [
                ConfigModule.forFeature(jwtConfig)
            ],
            useFactory: (config: ConfigType<typeof jwtConfig>) => {
                return {
                    secret: config.secretKey,
                    signOptions: {
                        expiresIn: config.expiresIn
                    }
                } as JwtModuleOptions;
            },
            inject: [
                jwtConfig.KEY
            ]
        }),
        DatabaseModule,
        UserModule,
        EnterpriseModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, LocalEnterpriseStrategy, JwtEnterpriseStrategy],
    exports: [AuthService]
})
export class AuthModule {
}
