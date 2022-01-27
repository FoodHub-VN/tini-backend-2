import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Res,
  Scope,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express, Request } from "express";
import { diskStorage } from "multer";
import { map, Observable } from "rxjs";
import { BServiceService } from "./b-service.service";
import { ModifyServiceDto } from "./dto/ModifyService.dto";

@Controller({ path: "service", scope: Scope.REQUEST })
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
  modifyService(@Body() data: ModifyServiceDto, @Res() res, @UploadedFile() file): Observable<Response> {
    return this.bSService.modifyService(data, data.serviceId).pipe(
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
}
