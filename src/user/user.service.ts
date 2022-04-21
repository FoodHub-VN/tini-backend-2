import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  COMMENT_MODEL,
  NOTIFICATION_MODEL,
  SCHEDULE_HISTORY_MODEL,
  SCHEDULE_MODEL, SCORE_MODEL,
  SERVICE_MODEL,
  USER_MODEL
} from "../database/database.constants";
import { User, UserModel } from "../database/model/user.model";
import { catchError, EMPTY, from, map, mergeMap, Observable, of, throwError, throwIfEmpty } from "rxjs";
import { UserRegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update.dto";
import { Schedule, ScheduleModel } from "../database/model/schedule";
import { Types } from "mongoose";
import { Service, ServiceModel } from "../database/model/service.model";
import { ScheduleHistory, ScheduleHistoryModel } from "../database/model/schedule-history.model";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UserPrincipal } from "../auth/interface/user-principal";
import { Comment, CommentModel } from "../database/model/comment.model";
import { getRatingScore } from "../shared/utility";
import { FileUploadService } from "../upload/upload.service";
import { Notification, NotificationModel } from "../database/model/notification.model";
import { NotiType } from "../shared/NotiType.type";
import { NotificationGateway } from "../notification/notification.gateway";
import { FileUploaded } from "../upload/interface/upload.interface";
import { ScoreModel } from "../database/model/scores.model";


@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
    @Inject(SCHEDULE_MODEL) private scheduleModel: ScheduleModel,
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(SCHEDULE_HISTORY_MODEL) private scheduleHistory: ScheduleHistoryModel,
    @Inject(REQUEST) private req: AuthenticatedRequest<UserPrincipal>,
    @Inject(COMMENT_MODEL) private commentModel: CommentModel,
    @Inject(NOTIFICATION_MODEL) private notiModel: NotificationModel,
    @Inject(SCORE_MODEL) private scoreModel: ScoreModel,
    private uploadService: FileUploadService,
    private notiSocket: NotificationGateway
  ) {
  }
  findUserWithPassByName(username: string, lean = false): Observable<User> {
    return from(this.userModel.findOne({ username },null,{lean}).select("+password").exec());
  }
  findUserByName(username: string, lean = false): Observable<User> {
    return from(this.userModel.findOne({ username },null,{lean}).exec());
  }

  async findUserById(userId: string): Promise<User>{
    return await this.userModel.findOne({_id: userId}, null, {lean: true}).exec();
  }
  register(data: UserRegisterDto): Observable<User> {
    return from(this.userModel.create({ ...data }));
  }

  existByUsername(username: string): Observable<boolean> {
    return from(this.userModel.exists({ username }));
  }

  existByMail(email: string): Observable<boolean> {
    return from(this.userModel.exists({ email }));
  }

  updateProfile(username: string, data: UpdateProfileDto): Observable<User> {
    return from(
      this.userModel.findOneAndUpdate(
        { username: username },
        { ...data },
        { new: true,lean: true }
      ).exec()
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`username: ${username} is not found!`))
    );
  }

  doneServiceSchedule(username: string, serviceId: string): Observable<Schedule> {
    return this.findUserByName(username).pipe(
      mergeMap((user) => {
        if (!user) {
          throw new NotFoundException("User not found!");
        } else {
          if (!Types.ObjectId.isValid(serviceId)) {
            throw new NotFoundException("Service not found!");
          }
          return from(this.scheduleModel.findOne({ service: serviceId, user: user._id }).exec()).pipe(
            map((schedule) => {
              if (!schedule) {
                throw new NotFoundException("Schedule List not found this service!");
              }
              return schedule;
            }),
            mergeMap((schedule) => {
              return from(this.scheduleHistory.create({
                user: user._id,
                service: Types.ObjectId(serviceId),
                date: Date.now(),
                hasRating: false
              })).pipe(
                mergeMap((h) => {
                  return from(schedule.remove());
                })
              );
            })
          );
        }
      })
    );
  }

  addSchedule(username: string, serviceId: string, time: Date): Observable<Schedule> {
    return this.findUserByName(username).pipe(
      mergeMap((user) => {
        if (!user) {
          throw new NotFoundException("User not found!");
        } else {
          if (!Types.ObjectId.isValid(serviceId)) {
            throw new NotFoundException("Service not found!");
          }
          return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec()).pipe(
            mergeMap((service) => {
              if (!service) {
                throw new NotFoundException("Service not found");
              } else {
                return from(this.scheduleModel.findOne({ service: Types.ObjectId(serviceId), user: user._id })).pipe(
                  mergeMap((schedule) => {
                    return from(this.scheduleModel.create({
                      user: user._id,
                      service: Types.ObjectId(serviceId),
                      timeServe: time
                    }));
                  })
                );
              }
            })
          );
        }
      })
    );
  }

  getAllSchedule(): Observable<Schedule[]> {
    return from(this.scheduleModel.find({ user: Types.ObjectId(this.req.user.id) }).populate(["service"]).exec());
  }

  addToFavorite(serviceId: string): Observable<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not Found");
    }
    return from(this.userModel.findOne({ _id: Types.ObjectId(this.req.user.id) }).exec()).pipe(
      mergeMap((user) => {
        if (user) {
          if (user.followedService.includes(serviceId)) {
            throw new ConflictException("This service has already been added to favorite!");
          } else {
            return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec()).pipe(
              mergeMap((service) => {
                if (!service) {
                  throw new NotFoundException("Service not found!");
                } else {
                  return from(user.update({ followedService: [...user.followedService, serviceId] }).exec()).pipe(
                    mergeMap((u) => {
                      if (u) {
                        let noti = {
                          user: user._id,
                          service: service._id,
                          hadRead: false,
                          type: NotiType.FOLLOWED,
                          date: Date.now()
                        };
                        return from(this.notiModel.create(noti)).pipe(
                          mergeMap(n => {
                            return from(n.populate([{ path: "user" }, { path: "service" }]).execPopulate())
                              .pipe(
                                map(d => {
                                  this.notiSocket.sendNotificationToClient(service.enterprise, d);
                                  this.notiSocket.sendNotificationToClient(user._id, d);
                                  return service;
                                })
                              );
                          })
                        )
                      } else {
                        throw new NotFoundException();
                      }
                    })
                  );
                }
              })
            );
          }
        } else {
          throw new NotFoundException();
        }
      })
    );
  }

  async removeFavorite(serviceId: string): Promise<any>{
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not Found");
    }
    try{
      const model = await this.userModel.findOne({_id: Types.ObjectId(this.req.user.id)}).exec();
      if(!model) throw new NotFoundException();
      if(!model.followedService.includes(serviceId)) {
        throw new ConflictException("This service hasn't been added to favorite!");
      }
      const serviceModel = await this.serviceModel.findOne({_id: Types.ObjectId(serviceId)}).exec();
      if(!serviceModel)  throw new NotFoundException("Service not found!");
      const newNoti = await this.notiModel.create({
        user: model._id,
        service: serviceModel._id,
        hadRead: false,
        type: NotiType.UNFOLLOWED,
        date: Date.now()
      })
      const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
      this.notiSocket.sendNotificationToClient(serviceModel.enterprise, newNotiDetail);
      this.notiSocket.sendNotificationToClient(model._id, newNotiDetail);
      return model.updateOne({followedService: model.followedService.filter((v)=>v!=serviceId)},{new: true}).exec();
      // return from(this.userModel.findOne({ _id: Types.ObjectId(this.req.user.id) }).exec()).pipe(
      //   mergeMap((user) => {
      //     if (user) {
      //       if (user.followedService.includes(serviceId)) {
      //         throw new ConflictException("This service has already been added to favorite!");
      //       } else {
      //         return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec()).pipe(
      //           mergeMap((service) => {
      //             if (!service) {
      //               throw new NotFoundException("Service not found!");
      //             } else {
      //               return from(user.update({ followedService: [...user.followedService, serviceId] }).exec()).pipe(
      //                 map((user) => {
      //                   if (user) {
      //                     return service;
      //                   } else {
      //                     throw new NotFoundException();
      //                   }
      //                 })
      //               );
      //             }
      //           })
      //         );
      //       }
      //     } else {
      //       throw new NotFoundException();
      //     }
      //   })
      // );
    }
    catch (e) {
      throw e;
    }
  }

  getFollowedService(): Observable<Service[]> {
    return from(this.userModel.findOne({
      _id: Types.ObjectId(this.req.user.id)
    }).populate("followedService").exec()).pipe(
      map((user) => {
        if (user) {
          return user.followedService as Service[];
        } else {
          throw new NotFoundException("User not found!");
        }
      })
    );
  }

  getHistorySchedule(): Observable<ScheduleHistory[]> {
    return from(this.scheduleHistory.find({ user: Types.ObjectId(this.req.user.id) }).populate("service").exec());
  }

  async ratingService(serviceId: string, score: number[], title: string, content: string, images: Array<Express.Multer.File> | undefined): Promise<Comment> {
    if (!Types.ObjectId(serviceId)) {
      throw new NotFoundException("Service not found");
    }
    try {
      let ratingScore = getRatingScore(score);
      var uploads;
      const service = await this.serviceModel.findOne({_id: Types.ObjectId(serviceId)}).exec();
      if(images && images.length>0){
        const promises = [];
        images.map(i=>{
          promises.push(this.uploadService.upload(i));
        })
        uploads = await Promise.all<FileUploaded>(promises);
        await service.update({imgCmtCount: service.imgCmtCount?service.imgCmtCount+images.length: 1}).exec();
      }
      await this.scoreModel.create({service: Types.ObjectId(serviceId), userRate: this.req.user.id, scores: score});
      await service.update({textCmtCount: service.textCmtCount?service.textCmtCount+1: 1}).exec();
      const comment = await this.commentModel.create({
        user: this.req.user.id,
        service: Types.ObjectId(serviceId),
        rating: ratingScore,
        title: title,
        content: content,
        images: uploads
      })
      return comment;
    }
    catch (e) {
      throw e;
    }
  }

  likeComment(commentId: string): Observable<Comment> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException("Comment not found");
    }
    let id = Types.ObjectId(commentId);
    return from(this.commentModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((comment) => {
        if (!comment) {
          throw new NotFoundException("Comment not found");
        } else {
          if (comment.userLiked.includes(this.req.user.id)) {
            let newUserLiked = comment.userLiked.filter((v) => v != this.req.user.id);
            return from(comment.update({
              userLiked: newUserLiked,
              numOfLike: newUserLiked.length
            }, { new: true }).exec());
          } else {
            return from(comment.update({
              userLiked: [...comment.userLiked, this.req.user.id],
              numOfLike: comment.userLiked.length + 1
            }).exec());
          }
        }
      })
    );
  }

  uploadAvatar(file: Express.Multer.File): Observable<FileUploaded> {
    return from(this.userModel.findOne({ _id: this.req.user.id }).exec())
      .pipe(
        mergeMap((user) => {
          if (user) {
            if (user.avatar) {
              return from(this.uploadService.delete(user.avatar.key))
                .pipe(
                  mergeMap((deleted) => {
                    return from(this.uploadService.upload(file))
                      .pipe(
                        mergeMap((fileUploaded) => {
                          return from(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                            .pipe(
                              map(updated => {
                                if (updated.ok == 1) {
                                  return fileUploaded;
                                }
                                throw new BadRequestException("Something wrong!");
                              })
                            );
                        })
                      );
                  })
                );
            } else {
              return from(this.uploadService.upload(file))
                .pipe(
                  mergeMap((fileUploaded) => {
                    return from(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                      .pipe(
                        map(updated => {
                          if (updated.ok == 1) {
                            return fileUploaded;
                          }
                          throw new BadRequestException("Something wrong!");
                        })
                      );
                  })
                );
            }
          } else {
            throwError(() => new Error());
          }
        }),
        catchError((err, cau) => {
          console.log(err);
          throw new BadRequestException({ err });
        })
      );
  }

  deleteAvatar(file: Express.Multer.File): Observable<boolean> {
    return from(this.userModel.findOne({ _id: this.req.user.id }).exec())
      .pipe(
        mergeMap((user) => {
          if (user) {
            return from(this.uploadService.delete(user.avatar.key))
              .pipe(
                map((b) => {
                  return b;
                })
              );
          } else {
            throw new NotFoundException("User does not exist!");
          }
        })
      );
  }
  async getAllNotifications(): Promise<Notification[]>{
    try{
      const notiModel = await this.notiModel.find({user: this.req.user.id}, null, {lean: true})
        .populate(["service", "user"])
        .exec()
      return notiModel;
    }catch (e){
      throw e;
    }
  }
  async readAllNoti(): Promise<any>{
    try {
      await this.notiModel.updateMany({ user: this.req.user.id }, { hadRead: true }).exec();
      return true;
    } catch (e) {
      throw e;
    }
  }
}
