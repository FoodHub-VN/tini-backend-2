import { Inject, Injectable, Scope } from "@nestjs/common";
import { ENTERPRISE_MODEL, SERVICE_MODEL } from "../database/database.constants";
import { Enterprise, EnterpriseModel } from "../database/model/enterprise.model";
import { from, map, Observable } from "rxjs";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";
import { EnterPriseNewServiceDataDto } from "./dto/enterprise-new-service.dto";
import { Service, ServiceModel } from "../database/model/service.model";
import { REQUEST } from "@nestjs/core";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { BServiceService } from "../b-service/b-service.service";

@Injectable({scope: Scope.REQUEST})
export class EnterpriseService {
  constructor(
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel,
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(BServiceService) private bService: BServiceService,
    @Inject(REQUEST) private req: AuthenticatedRequest<EnterprisePrincipal>
  ) {
  }

  findEnterpriseByName(name: string): Observable<Enterprise> {
    return from(this.enterpriseModel.findOne({ username: name }).exec());
  }

  existEnterpriseByName(name: string): Observable<boolean> {
    return from(this.enterpriseModel.exists({ username: name }));
  }

  existEnterpriseByMail(mail: string): Observable<boolean> {
    return from(this.enterpriseModel.exists({ email: mail }));
  }

  register(data: EnterpriseRegisterDto): Observable<Enterprise> {
    return from(this.enterpriseModel.create({ ...data }));
  }

  createNewService(data: EnterPriseNewServiceDataDto): Observable<any>{
    // return from(this.serviceModel.create({...data}));
    return this.bService.createService(data);
  }

  getInfo(): Observable<Enterprise>{
    return from(this.enterpriseModel.findOne({_id: this.req.user.id}).exec());
  }
}
