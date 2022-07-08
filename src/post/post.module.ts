import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UploadModule } from '../upload/upload.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UploadModule, DatabaseModule, AuthModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
