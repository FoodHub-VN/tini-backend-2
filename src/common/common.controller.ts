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
import { catchError, from, map, Observable } from "rxjs";
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
  getServiceInfo(@Res() res, @Param('idService') idService): Observable<Response> {
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

  @Get("/service/:idService/comments")
  getCommentService(@Res() res: Response, @Param('idService') idService): Observable<Response> {
    return from(this.bService.getComment(idService)).pipe(
      map(comments => {
        return res.status(HttpStatus.OK).send({comments: comments});
      }),
      catchError((e)=> {
        throw new BadRequestException("Something wrong!");
      })
    )
  }

  // enterprise info

  // @Get('/enterprise/:idEnterprise')
  // getEnterpriseInfo(@Res() res, @Param('idEnterprise') idEnterprise): Promise<Response>{
  //
  // }
}
