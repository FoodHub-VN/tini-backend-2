import { Global, Module } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwtConfig.config";

@Global()
@Module({
  imports:[
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forFeature(jwtConfig)
      ],
      useFactory: (config: ConfigType<typeof jwtConfig>) => {
        return {
          secret: config.secretKey,
          signOptions: {
            expiresIn: config.expiresIn
          },
          verifyOptions: {
            ignoreExpiration: true
          }
        } as JwtModuleOptions;
      },
      inject: [
        jwtConfig.KEY
      ]
    }),
  ],
  providers: [NotificationGateway],
  exports: [NotificationGateway]
})
export class NotificationModule {}
