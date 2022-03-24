import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileUploadService } from './upload.service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports:[ConfigModule],
  controllers: [UploadController],
  providers: [FileUploadService],
  exports: [FileUploadService]
})
export class UploadModule {}
