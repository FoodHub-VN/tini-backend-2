import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { CommonService } from "./common.service";
import { BServiceService } from "../b-service/b-service.service";

@Controller('')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly bService: BServiceService
  ) {
  }
  @Get('/categories')
  getCategory(@Res() res: Response): Observable<Response>{
    return this.commonService.getCategories().pipe(
      map((category) =>{
        if(category){
          return res.status(HttpStatus.OK).send({categories: category})
        }
        else{
          throw new BadRequestException();
        }
      })
    )
  }
  // service info
  @Get('/service/:idService')
  getInfo(@Res() res, @Param('idService') idService): Observable<Response> {
    return this.bService.getInfo(idService).pipe(
      map((s)=>{
        if(!s){
          throw new NotFoundException("Service not found!");
        }
        else{
          return res.status(HttpStatus.OK).send({service: s});
        }
      })
    );
  }
}
