import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import {
  CATEGORY_MODEL,
  COMMENT_MODEL,
  INTRODUCTION_MODEL,
  SCHEDULE_MODEL, SCORE_MODEL,
  SERVICE_MODEL
} from "../database/database.constants";
import { Service, ServiceModel } from "../database/model/service.model";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { catchError, from, map, mergeMap, Observable } from "rxjs";
import { Types } from "mongoose";
import { IntroductionModel } from "../database/model/introduction.model";
import { AddServiceIntroduceDto } from "./dto/AddServiceIntroduce.dto";
import { AddServiceOpenTimeDto } from "./dto/AddServiceOpenTime.dto";
import { Schedule, ScheduleModel } from "../database/model/schedule";
import { CategoryModel } from "../database/model/category.model";
import { FileUploadService } from "../upload/upload.service";
import { FileUploaded } from "../upload/interface/upload.interface";
import { Comment, CommentModel } from "../database/model/comment.model";
import { ScoreModel } from "../database/model/scores.model";
import { getRatingScore } from "../shared/utility";

@Injectable({ scope: Scope.REQUEST })
export class BServiceService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(INTRODUCTION_MODEL) private introductionModel: IntroductionModel,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>,
    @Inject(SCHEDULE_MODEL) private scheduleModel: ScheduleModel,
    @Inject(CATEGORY_MODEL) private categoryModel: CategoryModel,
    @Inject(COMMENT_MODEL) private commentModel : CommentModel,
    @Inject(SCORE_MODEL) private scoreModel : ScoreModel,
    private uploadService: FileUploadService
  ) {
  }

  async createService(data: EnterPriseNewServiceDataDto, images: Array<Express.Multer.File> | undefined): Promise<Service> {
    if (!Types.ObjectId.isValid(data.category)) {
      throw new NotFoundException("Category Not found");
    }
    console.log(data);
    try{
      const serviceExist = await this.serviceModel.findOne({ name: data.name }).exec();
      if (serviceExist) {
        throw new ConflictException("Service is already existing: " + serviceExist.name);
      }
      const checkCategory = await this.categoryModel.findOne({ _id: Types.ObjectId(data.category) }).exec();
      if (!checkCategory) {
        throw new ConflictException("Category not found");
      }

      if (images && images.length > 0) {
        let promises = [];
        images.map(e => {
          promises.push(this.uploadService.upload(e));
        });
        const res = await Promise.all<FileUploaded>(promises);
        return await this.serviceModel.create({ ...data, enterprise: this.req.user.id, images: res });
      } else {
        return await this.serviceModel.create({ ...data, enterprise: this.req.user.id });
      }
    }
    catch (e){
      throw e;
    }


    // return from(this.serviceModel.findOne({ $or: [{ name: data.name }] }).exec()).pipe(
    //   mergeMap(pre => {
    //     if (pre) {
    //       // console.log("Existing service before: ", pre);
    //       throw new ConflictException("Service is already existing: " + pre.name);
    //     } else {
    //       return from(this.categoryModel.findOne({_id: Types.ObjectId(data.category)}).exec()).pipe(
    //         mergeMap((category)=>{
    //           if(!category){
    //             throw new ConflictException("Category not found");
    //           }
    //           else{
    //             if(avatar){
    //               return from(this.uploadService.upload(avatar)).pipe(
    //                 mergeMap((file)=>{
    //                   return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id, avatar: file }));
    //                 }),
    //                 catchError((err)=>{
    //                   throw new BadRequestException(err);
    //                 })
    //               )
    //             }
    //             return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id }));
    //           }
    //         })
    //       )
    //
    //     }
    //   })
    // );
    // return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id }));
  }

  async modifyService(data: EnterPriseNewServiceDataDto, serviceId: string, images: Array<Express.Multer.File> | undefined): Promise<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found");
    }
    try {
      const { removeImg, ...__data } = data;
      let model = await this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec();
      if (removeImg && removeImg.length > 0) {
        const res = await this.uploadService.deleteMulti(removeImg);
        const filterImage = model.images.filter((e) => {
          return !removeImg.includes(e.key);
        });
        await model.update({ images: filterImage }).exec();
      }
      if (images && images.length > 0) {
        const promises = [];
        images.map(image => {
          promises.push(this.uploadService.upload(image));
        });
        const res = await Promise.all<FileUploaded>(promises);
        model = await this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec();
        model.images.push(...res);
        await model.save();
      }
      return await this.serviceModel.findOneAndUpdate({ _id: Types.ObjectId(serviceId) }, { ...__data }, { new: true }).exec();
    } catch (e) {
      throw e;
    }

    // return from(this.serviceModel.findOneAndUpdate({ _id: Types.ObjectId(serviceId) }, { ...data }).exec()).pipe(
    //   mergeMap((service) => {
    //     if (!service) {
    //       throw new NotFoundException("Service not found");
    //     } else {
    //       if(data.removeImg && data.removeImg.length>0){
    //         return from(this.uploadService.deleteMulti(data.removeImg))
    //           .pipe(
    //             mergeMap(res=>{
    //               return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec());
    //             })
    //           )
    //       }
    //       return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec());
    //     }
    //   })
    // );
  }

  addServiceIntroduce(data: AddServiceIntroduceDto, serviceId: string): Observable<any> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }
    return from(this.introductionModel.findOne({ service: Types.ObjectId(serviceId) }).exec()).pipe(
      mergeMap((intro) => {
        if (!intro) {
          return from(this.introductionModel.create({ service: Types.ObjectId(serviceId), content: data.content }));
        } else {
          return from(this.introductionModel.findOneAndUpdate(
            { service: Types.ObjectId(serviceId) },
            { content: data.content },
            { new: true }).exec());
        }
      }),
      catchError((err) => {
        throw new BadRequestException("Add introduce fail!");
      })
    );
  }

  addServiceOpenTime(data: AddServiceOpenTimeDto, serviceId: string): Observable<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }

    return from(this.serviceModel.findOneAndUpdate(
      { _id: Types.ObjectId(serviceId) },
      { openTime: data.openTime, closeTime: data.closeTime }).exec());
  }

  deleteService(serviceId: string): Observable<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }

    return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec()).pipe(
      map(service => {
        if (!service) throw new NotFoundException("Service not found!");
        return service;
      }),
      mergeMap((service) => {
        return from(service.remove());
      })
    );
  }

  getAllSchedule(serviceId: string): Observable<Schedule[]> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }
    return from(this.scheduleModel.find({ service: Types.ObjectId(serviceId) }).exec());
  }

  async getInfo(serviceId: string): Promise<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }
    const service = await this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).populate("enterprise", "-password").exec()
    return service;
  }

  async getComment(serviceId: string): Promise<Comment[]>{
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }
    const comment = await this.commentModel.find({service: serviceId}).populate(["user", "service"]).exec();
    return comment;
  }

  async getServiceScore(serviceId: string): Promise<Array<number>>{
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found!");
    }
    const defaultScore =[7,7,7,7,7,];
    try{
      const scores = await this.scoreModel.find({service: serviceId}).exec();
      if(scores.length<=0){
        return [...defaultScore, getRatingScore(defaultScore)];
      }
      const leanScore = scores.map(s=>s.scores);
      let resScore = [0,0,0,0,0];
      console.log(leanScore);
      leanScore.forEach((e)=>{
        resScore[0] = resScore[0] + e[0];
        resScore[1] = resScore[1] + e[1];
        resScore[2] = resScore[2] + e[2];
        resScore[3] = resScore[3] + e[3];
        resScore[4] = resScore[4] + e[4];
      })
      resScore.forEach((e, i)=>{resScore[i] = resScore[i]/leanScore.length});
      return [...resScore, getRatingScore(resScore)];
    }
    catch (e) {
      console.log(e);
      return [...defaultScore, getRatingScore(defaultScore)];
    }
  }
}
