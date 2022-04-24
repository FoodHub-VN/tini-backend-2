import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { DatabaseModule } from "../database/database.module";
import { BServiceModule } from "../b-service/b-service.module";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UploadModule } from "../upload/upload.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports:[DatabaseModule, BServiceModule, NestjsFormDataModule, UploadModule, ConfigModule],
  providers: [EnterpriseService],
  controllers: [EnterpriseController],
  exports: [EnterpriseService]
})
export class EnterpriseModule {}
