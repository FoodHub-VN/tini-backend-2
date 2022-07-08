import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: false,
        }),
        MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`),
        AuthModule,
        DatabaseModule,
        UploadModule,
        PostModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
