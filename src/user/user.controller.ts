import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRegisterDto } from "./dto/register.dto";
import { Response } from "express";
import { catchError, from, map, mergeMap, Observable, of } from "rxjs";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UpdateProfileDto } from "./dto/update.dto";
import { HasRole } from "../auth/guard/has-role.decorator";
import { RolesType } from "../shared/roles-type.enum";
import { RolesGuard } from "../auth/guard/roles.guard";
import { UserPrincipal } from "../auth/interface/user-principal";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { AddScheduleDto } from "./dto/add-schedule.dto";
import { DoneScheduleDto } from "./dto/done-schedule.dto";
import { AddFavoriteDto } from "./dto/add-favorite.dto";
import { RatingServiceDto } from "./dto/rating-service.dto";
import { LikeCommentDto } from "./dto/like-comment.dto";

@Controller({ path: "user" })
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post("/register")
  register(@Body() data: UserRegisterDto, @Res() res: Response) {
    const { username, email } = data;
    return this.userService.existByUsername(username).pipe(
      mergeMap(isUsernameExist => {
          if (isUsernameExist) {
            throw new ConflictException(`Username: ${username} is exist!`);
          } else {
            return this.userService.existByMail(email).pipe(
              mergeMap((isEmailExist) => {
                if (isEmailExist) {
                  throw  new ConflictException(`Email: ${email} is exist!`);
                                } else {
                                    return this.userService.register(data)
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

    @Get('/profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HasRole([RolesType.ADMIN])
    profile(@Req() req: AuthenticatedRequest<UserPrincipal>, @Res() res: Response): Observable<Response> {
        return this.userService.findUserByName(req.user.username, true).pipe(
            map(user => {
              const {password, avatar, ...data } = user;
                if (user) {
                  return res
                    .status(HttpStatus.OK)
                    .send({user: { ...data, avatar: avatar.url}});
                } else {
                    throw new NotFoundException('User not found!');
                }
            })
        );
    }

  @Put("/update-profile")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  @ApiConsumes("multipart/form-data")
    update(@Req() req: AuthenticatedRequest<UserPrincipal>, @Res() res: Response, @Body() body: UpdateProfileDto):Observable<Response> {
    console.log(body);
    return this.userService.updateProfile(req.user.username, body).pipe(
      map(user => {
        if (user) {
          return res.status(HttpStatus.OK).send(user);
        } else {
          throw new NotFoundException("User not Found");
        }
      })
    );
  }

  @Post("/add-schedule")
  @UseGuards(JwtAuthGuard)
  addSchedule(@Body() data: AddScheduleDto, @Req() req: AuthenticatedRequest<UserPrincipal>, @Res() res: Response): Observable<Response> {
    return from(this.userService.addSchedule(req.user.username, data.serviceId, data.timeServe)).pipe(
      map((schedule) => {
        if (schedule) {
          return res.status(HttpStatus.OK).send({ schedule: schedule });
        } else {
          throw new BadRequestException();
        }
      })
    );
  }

  @Post("/done-schedule")
  @UseGuards(JwtAuthGuard)
  doneSchedule(@Body() data: DoneScheduleDto, @Req() req: AuthenticatedRequest<UserPrincipal>, @Res() res: Response): Observable<Response> {
    return this.userService.doneServiceSchedule(req.user.username, data.serviceId).pipe(
      map((schedule) => {
        if (schedule) {
          return res.status(HttpStatus.OK).send({ schedule: schedule });
        }
        throw new BadRequestException();
      })
    );
  }

  @Get("schedules")
  @UseGuards(JwtAuthGuard)
  getAllSchedule(@Res() res: Response) {
    return this.userService.getAllSchedule().pipe(
      map((schedules) => {
        return res.status(HttpStatus.OK).send({
          schedules: schedules
        });
      }),
      catchError((err) => {
        throw new BadRequestException(err);
      })
    );
  }

  @Post("/add-favorite")
  @UseGuards(JwtAuthGuard)
  addServiceToFavorite(@Req() req: AuthenticatedRequest<UserPrincipal>,
                       @Body() data: AddFavoriteDto, @Res()
                         res: Response): Observable<Response> {
    return this.userService.addToFavorite(data.serviceId).pipe(
      map((service)=>{
        if(service){
          return res.status(HttpStatus.OK).send({serviceAdded: service});
        }
        else {
          throw new BadRequestException();
        }
      })
    )
  }

  @Get('/followed-service')
  @UseGuards(JwtAuthGuard)
  getFollowedService(@Res() res: Response): Observable<Response>{
    return this.userService.getFollowedService().pipe(
      map((services)=>{
        if(services){
          return res.status(HttpStatus.OK).send({services: services});
        }
        else{
          throw new NotFoundException();
        }
      })
    )
  }

  @Get('history-schedule')
  @UseGuards(JwtAuthGuard)
  getHistorySchedule(@Res() res: Response): Observable<Response>{
    return this.userService.getHistorySchedule().pipe(
      map((histories)=>{
        if(histories){
          return res.status(HttpStatus.OK).send({
            historys: histories
          })
        }
        else{
          throw new BadRequestException();
        }
      })
    )
  }

  @Post('rating-service')
  @UseGuards(JwtAuthGuard)
  ratingService(@Res()res: Response, @Body() data: RatingServiceDto): Observable<Response>{
    return this.userService.ratingService(data.serviceId, data.score, data.title, data.content).pipe(
      map((comment)=>{
        if(comment){
          return res.status(HttpStatus.OK).send({
            comment: comment
          })
        }
        else{
          throw new BadRequestException();
        }
      })
    )
  }

  @Post('like-comment')
  @UseGuards(JwtAuthGuard)
  likeComment(@Res() res: Response, @Body() data: LikeCommentDto): Observable<Response>{
    return this.userService.likeComment(data.commentId).pipe(
      map((comment) => {
        if (comment) {
          return res.status(HttpStatus.OK).send({ comment: comment });
        } else {
          throw new BadRequestException();
        }
      })
    )
  }

  @Post("upload-avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Observable<Response> {
    return from(this.userService.uploadAvatar(file))
      .pipe(
        map(url => {
          if (url) {
            return res.status(HttpStatus.OK).send({ url: url });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).send();
          }
        })
      );
  }
}
