import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule, ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwtConfig.config";
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [
        ConfigModule.forFeature(jwtConfig),
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
        HttpModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {
}
