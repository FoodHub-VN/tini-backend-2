import { BadRequestException, Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PostUploadDto } from './dto/post-upload.dto';
import { TiniGuard } from '../auth/guard/tini.guard';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UpVoteDto } from './dto/up-vote.dto';
import { DownVoteDto } from './dto/down-vote.dto';
import { FavoritePostDto } from './dto/favorite.dto';

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
  @ApiBearerAuth()
  @Post('up-vote')
  async upVotePost(@Res() res: Response, @Req() req: AuthReqInterface, @Body() body: UpVoteDto){
      try{
        let post = await this.postService.upVote(req, body.postId);
        return res.status(HttpStatus.OK).send({post});
      }
      catch (e){
        throw e;
      }
  }

  @UseGuards(TiniGuard)
  @ApiBearerAuth()
  @Post('down-vote')
  async downVotePost(@Res() res: Response, @Req() req: AuthReqInterface, @Body() body: DownVoteDto) {
    try {
      let post = await this.postService.downVote(req, body.postId);
      return res.status(HttpStatus.OK).send({ post });
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(TiniGuard)
  @ApiBearerAuth()
  @Post('favorite')
  async favoritePost(@Res() res: Response, @Req() req: AuthReqInterface, @Body() body: FavoritePostDto) {
    try {
      let success = await this.postService.favoritePost(req, body.postId);
      if (success) {
        return res.status(HttpStatus.OK).send({status: "success"});
      }
      throw new BadRequestException('Wrong!');
    } catch (e) {
      throw e;
    }
  }

}
