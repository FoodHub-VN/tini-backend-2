import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { CATEGORY_MODEL, INTRODUCTION_MODEL, SCHEDULE_MODEL, SERVICE_MODEL } from "../database/database.constants";
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

@Injectable({ scope: Scope.REQUEST })
export class BServiceService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(INTRODUCTION_MODEL) private introductionModel: IntroductionModel,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>,
    @Inject(SCHEDULE_MODEL) private scheduleModel: ScheduleModel,
    @Inject(CATEGORY_MODEL) private categoryModel: CategoryModel,
    private uploadService: FileUploadService
  ) {
  }

  createService(data: EnterPriseNewServiceDataDto, avatar: Express.Multer.File | undefined): Observable<any> {
    if(!Types.ObjectId.isValid(data.category)){
      throw new NotFoundException("Category Not found");
    }
    return from(this.serviceModel.findOne({ $or: [{ name: data.name }] }).exec()).pipe(
      mergeMap(pre => {
        if (pre) {
          // console.log("Existing service before: ", pre);
          throw new ConflictException("Service is already existing: " + pre.name);
        } else {
          return from(this.categoryModel.findOne({_id: Types.ObjectId(data.category)}).exec()).pipe(
            mergeMap((category)=>{
              if(!category){
                throw new ConflictException("Category not found");
              }
              else{
                if(avatar){
                  return from(this.uploadService.upload(avatar)).pipe(
                    mergeMap((file)=>{
                      return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id, avatar: file }));
                    }),
                    catchError((err)=>{
                      throw new BadRequestException(err);
                    })
                  )
                }
                return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id }));
              }
            })
          )

        }
      })
    );
    // return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id }));
  }

  modifyService(data: EnterPriseNewServiceDataDto, serviceId: string): Observable<Service> {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new NotFoundException("Service not found");
    }
    return from(this.serviceModel.findOneAndUpdate({ _id: Types.ObjectId(serviceId) }, { ...data }).exec()).pipe(
      mergeMap((service) => {
        if (!service) {
          throw new NotFoundException("Service not found");
        } else {
          return from(this.serviceModel.findOne({ _id: Types.ObjectId(serviceId) }).exec());
        }
      })
    );
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

  addServiceOpenTime(data: AddServiceOpenTimeDto, serviceId: string): Observable<Service>{
    if(!Types.ObjectId.isValid(serviceId)){
      throw new NotFoundException("Service not found!");
    }

    return from(this.serviceModel.findOneAndUpdate(
      {_id: Types.ObjectId(serviceId)},
      {openTime: data.openTime, closeTime: data.closeTime}).exec());
  }

  deleteService(serviceId: string): Observable<Service>{
    if(!Types.ObjectId.isValid(serviceId)){
      throw new NotFoundException("Service not found!");
    }

    return from(this.serviceModel.findOne({_id: Types.ObjectId(serviceId)}).exec()).pipe(
      map(service=>{
        if(!service) throw new NotFoundException("Service not found!");
        return service;
      }),
      mergeMap((service)=>{
        return from(service.remove())
      })
    );
  }

  getAllSchedule(serviceId: string): Observable<Schedule[]>{
    if(!Types.ObjectId.isValid(serviceId)){
      throw new NotFoundException("Service not found!");
    }
    return from(this.scheduleModel.find({service: Types.ObjectId(serviceId)}).exec());
  }

  getInfo(serviceId: string): Observable<Service>{
    if(!Types.ObjectId.isValid(serviceId)){
      throw new NotFoundException("Service not found!");
    }
    return from(this.serviceModel.findOne({_id: Types.ObjectId(serviceId)}).populate("enterprise", "-password").exec());
  }
}
