import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ServiceModel } from "../database/model/service.model";
import { EnterpriseModel } from "../database/model/enterprise.model";
export declare class OwnerInterceptor implements NestInterceptor {
    private serviceModel;
    private enterpriseModel;
    constructor(serviceModel: ServiceModel, enterpriseModel: EnterpriseModel);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
