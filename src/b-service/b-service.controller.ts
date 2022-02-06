import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  Scope,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express, Request, Response } from "express";
import { diskStorage } from "multer";
import { map, Observable } from "rxjs";
import { BServiceService } from "./b-service.service";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { AddServiceIntroduceDto } from "./dto/AddServiceIntroduce.dto";

@Controller({ path: ":idService", scope: Scope.REQUEST })
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
    console.log(file.path);
  }

  @Put("modify-service")
  @UseInterceptors(FileInterceptor("avatar"))
  modifyService(@Body() data: EnterPriseNewServiceDataDto,
                @Res() res,
                @UploadedFile() file,
                @Param("idService") idService): Observable<Response> {
    return this.bSService.modifyService(data, idService).pipe(
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

  @Post("addIntroduce")
  addServiceIntroduce(@Body() data: AddServiceIntroduceDto, @Param("idService") idService, @Res() res):Observable<Response> {
    return this.bSService.addServiceIntroduce(data, idService).pipe(
      map((intro)=>{
        if(intro){
          return res.status(HttpStatus.OK).send({intro: intro});
        }
        else{
          throw new BadRequestException("Cannot create introduction");
        }
      })
    );
  }
}
