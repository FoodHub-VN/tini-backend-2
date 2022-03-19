import { BadRequestException, Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { CommonService } from "./common.service";

@Controller('')
export class CommonController {
  constructor(
    private readonly commonService: CommonService
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
}
