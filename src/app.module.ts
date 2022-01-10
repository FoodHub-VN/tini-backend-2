import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { EnterpriseModule } from './enterprise/enterprise.module';

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://localhost/nestjs-test"),
        AuthModule,
        UserModule,
        DatabaseModule,
        ConfigModule.forRoot({
            ignoreEnvFile: true
        }),
        EnterpriseModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
