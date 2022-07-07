import { Body, Controller, Delete, Get, HttpStatus, Param, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from "express";
import { TiniGuard } from './auth/guard/tini.guard';
import { GetTokenDto } from './auth/dto/get-token.dto';
import { AuthReqInterface } from './auth/interface/auth-req.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(TiniGuard)
  getHello(@Req() req: any): string {
    console.log(req.user);
    return this.appService.getHello();
  }

  @UseGuards(TiniGuard)
  @Put('/testPut')
  testPut(@Res() res: Response, @Req() req: AuthReqInterface){
    return res.status(HttpStatus.OK).send({status: "Success!", user: req.user});
  }
  @Delete('/testDelete')
  testDelete(@Res() res: Response){
    return res.status(HttpStatus.OK).send({status: "Success!"});
  }

}
