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
  UploadedFile, UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRegisterDto } from "./dto/register.dto";
import { Response } from "express";
import { catchError, from, map, mergeMap, Observable } from "rxjs";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UpdateProfileDto } from "./dto/update.dto";
import { HasRole } from "../auth/guard/has-role.decorator";
import { RolesType } from "../shared/roles-type.enum";
import { RolesGuard } from "../auth/guard/roles.guard";
import { UserPrincipal } from "../auth/interface/user-principal";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { AddScheduleDto } from "./dto/add-schedule.dto";
import { DoneScheduleDto } from "./dto/done-schedule.dto";
import { AddFavoriteDto } from "./dto/add-favorite.dto";
import { RatingServiceDto } from "./dto/rating-service.dto";
import { LikeCommentDto } from "./dto/like-comment.dto";
import { DeleteCommentDto } from "./dto/delete-comment.dto";

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
                    .send({user: { ...data, avatar: avatar}});
                } else {
                    throw new NotFoundException('User not found!');
                }
            })
        );
    }

  @Put("/update-profile")
  @UseGuards(JwtAuthGuard)
    update(@Req() req: AuthenticatedRequest<UserPrincipal>, @Res() res: Response, @Body() body: UpdateProfileDto):Observable<Response> {
    console.log(body);
    return this.userService.updateProfile(req.user.username, body).pipe(
      map(u => {
        if (u) {
          return res.status(HttpStatus.OK).send({ user: {...u, avatar:u.avatar?.url} });
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

  @Post('unschedule')
  @UseGuards(JwtAuthGuard)
  unSchedule(@Body() data: any, @Res() res: Response): Observable<Response>{
    return from(this.userService.removeSchedule(data.id))
      .pipe(
        map(r=>res.status(HttpStatus.OK).send()),
        catchError((err)=>{
          throw err;
        })
      )
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

  @Post('/remove-favorite')
  @UseGuards(JwtAuthGuard)
  removeServiceFromFavorite(@Req() req: AuthenticatedRequest<UserPrincipal>,
                            @Body() data: AddFavoriteDto,
                            @Res() res: Response
                            ) : Observable<Response>{
    return from(this.userService.removeFavorite(data.serviceId)).pipe(
      map(s=>{
        return res.status(HttpStatus.OK).send();
      }),
      catchError((e)=> {
        throw e;
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
  @UseInterceptors(FilesInterceptor("images"))
  ratingService(@Res()res: Response, @Body() data: RatingServiceDto, @UploadedFiles() files: Array<Express.Multer.File>): Observable<Response>{
    return from(this.userService.ratingService(data.serviceId, data.score, data.title, data.content, files)).pipe(
      map((comment)=>{
        if(comment){
          return res.status(HttpStatus.OK).send({
            comment: comment
          })
        }
      }),
      catchError((e)=>{
        throw new BadRequestException('Something wrong!');
      })
    )
  }

  @Post('delete-rating')
  @UseGuards(JwtAuthGuard)
  deleteRatingService(@Res() res: Response, @Body() data: DeleteCommentDto): Observable<Response>{
    return from(this.userService.deleteRating(data.id))
      .pipe(
        map(r=>res.status(HttpStatus.OK).send()),
        catchError(e=>{throw e;})
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
        map(file => {
          if (file) {
            return res.status(HttpStatus.OK).send({ avatar: file });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).send();
          }
        })
      );
  }
  @UseGuards(JwtAuthGuard)
  @Get("notifications")
  getNotifications(@Res() res: Response): Observable<Response>{
    return from(this.userService.getAllNotifications()).pipe(
      map((noti)=>{
        return res.status(HttpStatus.OK).send({noti: noti});
      }),
      catchError((e)=>{
        console.log(e);
        throw new BadRequestException(e);
      })
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post("readAllNoti")
  readAllNoti(@Res() res: Response): Observable<Response>{
    return from(this.userService.readAllNoti()).pipe(
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
}
