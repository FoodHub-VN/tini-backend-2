import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { INTRODUCTION_MODEL, SERVICE_MODEL } from "../database/database.constants";
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

@Injectable({ scope: Scope.REQUEST })
export class BServiceService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(INTRODUCTION_MODEL) private introductionModel: IntroductionModel,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>
  ) {
  }

  createService(data: EnterPriseNewServiceDataDto): Observable<any> {
    return from(this.serviceModel.findOne({ $or: [{ name: data.name }] }).exec()).pipe(
      mergeMap(pre => {
        if (pre) {
          // console.log("Existing service before: ", pre);
          throw new ConflictException("Service is already existing: " + pre.name);
        } else {
          return from(this.serviceModel.create({ ...data, enterprise: this.req.user.id }));
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
      }),
      catchError((err) => {
        throw new BadRequestException("Fail");
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

  deleteService(serviceId: string){
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
}
