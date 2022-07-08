import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PostUploadDto } from './dto/post-upload.dto';
import { TiniGuard } from '../auth/guard/tini.guard';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UpVoteDto } from './dto/up-vote.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Post('upload')
  @UseGuards(TiniGuard)
  @ApiBearerAuth()
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor("images"))
  async uploadPost(
    @Res() res: Response,
    @Body() data: PostUploadDto,
    @Req() req: AuthReqInterface
  ){
    try{
      await this.postService.uploadPost(data, req);
      return res.status(200).send({status: "success"});
    }
    catch (e){
      throw e;
    }
  }

  @Post('get-all-post')
  async getAllPost(
    @Res() res: Response
  ): Promise<any>{
    try{
      let posts = await this.postService.getAllPost();
      return res.status(HttpStatus.OK).send({posts})
    }
    catch (e) {
      throw new BadRequestException();
    }
  }

  @UseGuards(TiniGuard)
  async upVotePost(@Res() res: Response, @Req() req: AuthReqInterface, @Body() body: UpVoteDto){

  }

}
