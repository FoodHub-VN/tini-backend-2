import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { EnterpriseModule } from './enterprise/enterprise.module';
import { BServiceModule } from './b-service/b-service.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationGateway } from './notification/notification.gateway';
import mongodbConfig from "./config/mongodb.config";
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;
@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://localhost:27017/`),
        AuthModule,
        UserModule,
        DatabaseModule,
        ConfigModule.forRoot({
            ignoreEnvFile: false
        }),
        EnterpriseModule,
        BServiceModule,
        UploadModule,
        SearchModule,
        AdminModule,
        CommonModule,
        NotificationModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
