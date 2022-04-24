import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  Scope,
  UploadedFile, UploadedFiles, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express, Request, Response } from "express";
import { diskStorage } from "multer";
import { from, map, Observable, of } from "rxjs";
import { BServiceService } from "./b-service.service";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { AddServiceIntroduceDto } from "./dto/AddServiceIntroduce.dto";
import { AddServiceOpenTimeDto } from "./dto/AddServiceOpenTime.dto";
import { OwnerInterceptor } from "./owner.interceptor";
import { JwtEnterpriseAuthGuard } from "../auth/guard/jwt-auth.guard";

@UseGuards(JwtEnterpriseAuthGuard)
@UseInterceptors(OwnerInterceptor)
@Controller({ path: "service/:idService", scope: Scope.REQUEST })
export class BServiceController {
  constructor(private bSService: BServiceService) {
  }

  @Post("testUpload")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./upload",
      filename: (req: Request, file: Express.Multer.File, callback): any => {
        callback(null, file.originalname);
      }
    })
  }))
  upload(@UploadedFile() file: Express.Multer.File) {
  }

  @Put("modify-service")
  @UseInterceptors(FilesInterceptor("images"))
  modifyService(@Body() data: EnterPriseNewServiceDataDto,
                @Res() res,
                @UploadedFiles() files: Array<Express.Multer.File>,
                @Param("idService") idService): Observable<Response> {
    return from(this.bSService.modifyService(data, idService, files)).pipe(
      map(service => {
        if (!service) {
          throw new NotFoundException(`Not Found service ${data.name}`);
        } else {
          return res.status(HttpStatus.OK).send({
            service: service
          });
        }
      })
    );
  }

  @Post("add-introduce")
  addServiceIntroduce(@Body() data: AddServiceIntroduceDto,
                      @Param("idService") idService,
                      @Res() res):Observable<Response> {
    return this.bSService.addServiceIntroduce(data, idService).pipe(
      map((intro) => {
        if (intro) {
          return res.status(HttpStatus.OK).send({ intro: intro });
        } else {
          throw new BadRequestException("Cannot create introduction");
        }
      })
    );
  }

  @Post("add-opentime")
  addServiceOpenTime(@Body() data: AddServiceOpenTimeDto,
                     @Res() res,
                     @Param("idService") idService): Observable<Response> {
    return this.bSService.addServiceOpenTime(data, idService).pipe(
      map((service)=>{
        if(!service){
          throw new NotFoundException("Service not found!");
        }
        else{
          return res.status(HttpStatus.OK).send({ service: service});
        }
      })
    )
  }
  @Post('delete')
  deleteService(@Res() res, @Param("idService") idService): Observable<Response> {
    return this.bSService.deleteService(idService).pipe(
      map((service) => {
        if (!service) {
          throw new NotFoundException("Service not found");
        }
        return res.status(HttpStatus.OK).send({ service: service });
      })
    );
  }

  @Get("schedules")
  getAllSchedule(@Res() res, @Param("idService") idService): Observable<Response> {
    return this.bSService.getAllSchedule(idService).pipe(
      map((schedules) => {
        return res.status(HttpStatus.OK).send({ schedules: schedules });
      })
    );
  }


}
