import { Inject, Injectable } from "@nestjs/common";
import { ENTERPRISE_MODEL } from "../database/database.constants";
import { Enterprise, EnterpriseModel } from "../database/model/enterprise.model";
import { from, Observable } from "rxjs";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";

@Injectable()
export class EnterpriseService {
  constructor(
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel
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
}
