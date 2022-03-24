import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UploadModule } from "../upload/upload.module";

@Module({
    imports: [
        DatabaseModule,
        UploadModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
}
