import { BadRequestException, Body, Controller, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { JwtAdminAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Response } from "express";
import { AdminService } from "./admin.service";
import { map, Observable } from "rxjs";
import { AddCategoryDto } from "./dto/add-category.dto";

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {
  }
  @UseGuards(JwtAdminAuthGuard)
  @Post('/add-category')
  addCategory(@Body() data: AddCategoryDto, @Res() res: Response): Observable<Response>{
    return this.adminService.addCategory(data.category).pipe(
      map(( b)=>{
        if(b){
          return res.status(HttpStatus.OK).send();
        }
        else{
          throw new BadRequestException();
        }
      })
    )
  }
}
