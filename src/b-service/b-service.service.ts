import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Scope
} from "@nestjs/common";
import { SERVICE_MODEL } from "../database/database.constants";
import { Service, ServiceModel } from "../database/model/service.model";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { from, map, mergeMap, Observable, of } from "rxjs";
import { ModifyServiceDto } from "./dto/ModifyService.dto";
import { Schema, Types } from "mongoose";

@Injectable({ scope: Scope.REQUEST })
export class BServiceService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
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

  modifyService(data: ModifyServiceDto, serviceId: string): Observable<Service> {

    const {serviceId: _serviceId, ..._data} = data;
      return from(this.serviceModel.findOneAndUpdate({_id: Types.ObjectId(serviceId)}, {...data}).exec()).pipe(
        mergeMap((service)=>{
          if(!service){
            throw new NotFoundException("Serivce not found");
          }
          else{
            return from(this.serviceModel.findOne({_id: Types.ObjectId(serviceId)}));
          }
        })
      )
  }

  isEnterpriseContainService(enterprise: string, service: string): Observable<boolean> {
    return from(this.serviceModel.findOne({ $or: [{ _id: service }] }).exec()).pipe(
      map(s => {
        if (s.enterprise == enterprise) {
          return true;
        }
        else{
          return false;
        }
      })
    );
  }
}
