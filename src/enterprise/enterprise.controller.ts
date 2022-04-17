import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Res,
  Scope, UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { catchError, from, map, mergeMap, Observable } from "rxjs";
import { Express, Response } from "express";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";
import { EnterPriseNewServiceDataDto } from "./dto/enterprise-new-service.dto";
import { JwtAuthGuard, JwtEnterpriseAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Public } from "../auth/guard/public.guard.decorator";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { ReadNotiDto } from "./dto/read-noti.dto";
import { DeleteScheduleDto } from "./dto/delete-schedule.dto";
import { DoneScheduleDto } from "./dto/done-schedule.dto";
import { EnterpriseEditDto } from "./dto/enterprise-edit.dto";


@UseGuards(JwtEnterpriseAuthGuard)
@Controller({ path: "enterprise", scope: Scope.REQUEST})
export class EnterpriseController {
  constructor(
    private enterpriseService: EnterpriseService,
    @Inject(REQUEST) req: AuthenticatedRequest<EnterprisePrincipal>
  ) {
  }

  @Public()
  @Post("/register")
  register(@Body() data: EnterpriseRegisterDto, @Res() res: Response) {
    const { username, email } = data;
    console.log(username)
    return this.enterpriseService.existEnterpriseByName(username).pipe(
      mergeMap(b => {
          if (b) {
            throw new ConflictException(`Enterprise ${username} already exists!`);
          } else {
            return this.enterpriseService.existEnterpriseByMail(email).pipe(
              mergeMap((isEmailExist) => {
                if (isEmailExist) {
                  throw  new ConflictException(`Email: ${email} is exist!`);
                } else {
                  return this.enterpriseService.register(data)
                    .pipe(
                      map(user => res
                        .status(HttpStatus.OK)
                        .send({
                          username: username,
                          email: email
                        })
                      )
                    );
                }
              })
            );
          }

        }
      )
    );
  }

  //region create new service
  @Post("/new-service")
  @UseInterceptors(FilesInterceptor("images"))
  // @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "New service from enterprise",
    type: EnterPriseNewServiceDataDto
  })
  @ApiImplicitFile({
    name: 'avatar',
    required: true,
    description: 'Avatar of service',
  })
  newService(@Body() data: EnterPriseNewServiceDataDto, @Res() res: Response , @UploadedFiles() files: Array<Express.Multer.File>): Observable<Response> {
    return this.enterpriseService.createNewService(data, files).pipe(
      map(service => {
        console.log(service)
        return res.status(HttpStatus.OK).send({ service: service });
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  //endregion create new service


  // enterprise info

  @Get("")
  getInfo(@Res() res): Observable<Response> {
    return this.enterpriseService.getInfo().pipe(
      map((e) => {
        if (!e) {
          throw new NotFoundException("Enterprise not found");
        } else {
          const {password,...data } = e;
          return res.status(HttpStatus.OK).send({ enterprise: data });
        }
      })
    );
  }

  @Get("all-services")
  getAllService(@Res() res: Response): Observable<Response> {
    return this.enterpriseService.getAllService().pipe(
      map((services) => {
        if (!services) {
          throw new NotFoundException();
        } else {
          return res.status(HttpStatus.OK).send({ services: services });
        }
      })
    );
  }

  @Get("notifications")
  getNotifications(@Res() res: Response): Observable<Response>{
    return from(this.enterpriseService.getAllNotifications()).pipe(
      map((noti)=>{
        return res.status(HttpStatus.OK).send({noti: noti});
      }),
      catchError((e)=>{
        throw new BadRequestException(e);
      })
    )
  }

  @Post("readNoti")
  readNoti(@Res() res: Response, @Body() data: ReadNotiDto): Observable<Response> {
    return from(this.enterpriseService.readNoti(data.notiId)).pipe(
      map(r=>{
        if(r){
          return res.status(HttpStatus.OK).send();
        }
      })
    )
  }
  @Post("readAllNoti")
  readAllNoti(@Res() res: Response): Observable<Response>{
    return from(this.enterpriseService.readAllNoti()).pipe(
      map(b=>{
        if(b){
          return res.status(HttpStatus.OK).send();
        }
      }),
      catchError((e)=>{
        throw new BadRequestException("Something wrong!");
      })
    )
  }

  @Post("buyPremium")
  buyPremium(@Res() res: Response, @Body() data: any): Observable<Response>{
    return from(this.enterpriseService.buyPremium(data.id))
      .pipe(
        map(e=>{
          return res.status(HttpStatus.OK).send();
        })
      )
      ;
  }

  @Get('allSchedule')
  getSchedules(@Res() res: Response) : Observable<Response>{
    return from(this.enterpriseService.getSchedules())
      .pipe(
        map(s=>res.status(HttpStatus.OK).send({schedules: s})),
        catchError((e)=>{
          throw e;
        })
      )
  }

  @Post('deleteSchedule')
  deleteSchedule(@Res() res: Response, @Body() data: DeleteScheduleDto) : Observable<Response>{
    return from(this.enterpriseService.deleteSchedule(data.id)).pipe(
      map(r=>{
        return res.status(HttpStatus.OK).send();
      }),
      catchError(e=>{
        throw e;
      })
    )
  }
  @Post('doneSchedule')
  doneSchedule(@Res() res: Response, @Body() data: DoneScheduleDto) : Observable<Response>{
    return from(this.enterpriseService.doneSchedule(data.id)).pipe(
      map(r=>{
        return res.status(HttpStatus.OK).send();
      }),
      catchError(e=>{
        throw e;
      })
    )
  }

  @Post("upload-avatar")
  @UseInterceptors(FileInterceptor("image"))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Observable<Response> {
    return from(this.enterpriseService.uploadAvatar(file))
      .pipe(
        map(file => {
          if (file) {
            return res.status(HttpStatus.OK).send({ avatar: file });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).send();
          }
        })
      );
  }
  @Post('update-profile')
  updateProfile(@Res() res: Response, @Body() data: EnterpriseEditDto): Observable<Response> {
    return from(this.enterpriseService.updateProfile(data))
      .pipe(
        map(r=>res.status(HttpStatus.OK).send(r)),
        catchError((e)=>{
          throw e;
        })
      )
  }
  @Get('get-overview-analysis')
  getOverviewAnalysis(@Res() res: Response): Observable<Response> {
    return from(this.enterpriseService.getOverviewAnalysis())
      .pipe(
        map(r=>res.status(HttpStatus.OK).send(r))
      )
  }

}
