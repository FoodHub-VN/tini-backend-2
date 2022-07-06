import { Controller, Delete, Get, HttpStatus, Param, Put, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Put('/testPut')
  testPut(@Res() res: Response){
    return res.status(HttpStatus.OK).send({status: "Success!"});
  }
  @Delete('/testDelete')
  testDelete(@Res() res: Response){
    return res.status(HttpStatus.OK).send({status: "Success!"});
  }

}
