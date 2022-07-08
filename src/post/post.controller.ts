import { Body, Controller, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {Response} from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PostUploadDto } from './dto/post-upload.dto';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("images"))
  uploadPost(
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: PostUploadDto
  ){

  }
}
