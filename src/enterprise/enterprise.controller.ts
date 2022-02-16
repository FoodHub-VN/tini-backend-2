import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus, Inject,
  Post, Put,
  Res,
  Scope, UploadedFile,
  UseGuards, UseInterceptors, UsePipes
} from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { catchError, from, map, mergeMap, Observable, of } from "rxjs";
import { Express, Request, Response } from "express";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";
import { EnterPriseNewServiceDataDto } from "./dto/enterprise-new-service.dto";
import { JwtEnterpriseAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Public } from "../auth/guard/public.guard.decorator";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FormDataRequest } from "nestjs-form-data";
import { ValidationPipe } from "./validator/validator";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";


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
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./upload",
      filename: (req: Request, file: Express.Multer.File, callback): any => {
        callback(null, file.originalname);
      }
    })
  }))
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
  newService(@Body() data: EnterPriseNewServiceDataDto, @Res() res: Response , @UploadedFile() file: Express.Multer.File): Observable<Response> {
    console.log(data)
    return this.enterpriseService.createNewService(data).pipe(
      map(service => {
        console.log(service)
        return res.status(HttpStatus.OK).send({service: service});
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  //endregion create new service


}
