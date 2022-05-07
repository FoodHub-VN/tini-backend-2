import { forwardRef, Module } from "@nestjs/common";
import { BServiceService } from "./b-service.service";
import { BServiceController } from "./b-service.controller";
import { DatabaseModule } from "../database/database.module";
import { UploadModule } from "../upload/upload.module";
import { EnterpriseModule } from "../enterprise/enterprise.module";

@Module({
  providers: [BServiceService],
  controllers: [BServiceController],
  imports: [DatabaseModule, UploadModule, forwardRef(()=>EnterpriseModule)],
  exports: [BServiceService]
})
export class BServiceModule {
}
