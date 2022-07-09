import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import {DatabaseModule} from "../database/database.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
