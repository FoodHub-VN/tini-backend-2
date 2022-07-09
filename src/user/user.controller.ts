import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import {Response} from 'express';
import { TiniGuard } from '../auth/guard/tini.guard';
import { FollowUserDto, UnFollowUserDto } from './dto/follow-user.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ){

  }


  @Post('follow')
  @UseGuards(TiniGuard)
  @ApiBearerAuth()
  async followUser(@Res() res: Response, @Body() body: FollowUserDto, @Req() req: AuthReqInterface){
      try{
        let success = await this.userService.followUser(req, body.userId);
        return res.status(HttpStatus.OK).send({status: "success"});
      } catch (e){
        throw e;
      }
  }

  @Post('un-follow')
  @UseGuards(TiniGuard)
  @ApiBearerAuth()
  async unFollowUser(@Res() res: Response, @Body() body: UnFollowUserDto, @Req() req: AuthReqInterface){
    try{
      let success = await this.userService.unFollowUser(req, body.userId);
      return res.status(HttpStatus.OK).send({status: "success"});
    } catch (e){
      throw e;
    }
  }
}
