import { Body, Controller, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {Response} from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PostUploadDto } from './dto/post-upload.dto';
import { TiniGuard } from '../auth/guard/tini.guard';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Post('upload')
  @UseGuards(TiniGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor("images"))
  async uploadPost(
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: PostUploadDto,
    @Req() req: AuthReqInterface
  ){
    try{
      await this.postService.uploadPost(data, files, req);
      return res.status(200).send({status: "success"});
    }
    catch (e){
      throw e;
    }
  }
}
