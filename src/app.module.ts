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

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://localhost/nestjs-test"),
        AuthModule,
        UserModule,
        DatabaseModule,
        ConfigModule.forRoot({
            ignoreEnvFile: true
        }),
        EnterpriseModule,
        BServiceModule,
        UploadModule,
        SearchModule,
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
