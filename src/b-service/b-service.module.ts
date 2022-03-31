import { Module } from "@nestjs/common";
import { BServiceService } from "./b-service.service";
import { BServiceController } from "./b-service.controller";
import { DatabaseModule } from "../database/database.module";
import { UploadModule } from "../upload/upload.module";

@Module({
  providers: [BServiceService],
  controllers: [BServiceController],
  imports: [DatabaseModule, UploadModule],
  exports: [BServiceService]
})
export class BServiceModule {
}
