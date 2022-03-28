import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { DatabaseModule } from "../database/database.module";
import { BServiceModule } from "../b-service/b-service.module";

@Module({
  imports: [DatabaseModule, BServiceModule],
  controllers: [CommonController],
  providers: [CommonService]
})
export class CommonModule {}
