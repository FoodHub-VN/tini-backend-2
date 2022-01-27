import { Module } from '@nestjs/common';
import { BServiceService } from './b-service.service';
import { BServiceController } from './b-service.controller';
import { DatabaseModule } from "../database/database.module";

@Module({
  providers: [BServiceService],
  controllers: [BServiceController],
  imports: [DatabaseModule],
  exports: [BServiceService]
})
export class BServiceModule {}
