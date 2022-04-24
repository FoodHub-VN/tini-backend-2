/// <reference types="multer" />
import { Response } from "express";
import { Observable } from "rxjs";
import { BServiceService } from "./b-service.service";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { AddServiceIntroduceDto } from "./dto/AddServiceIntroduce.dto";
import { AddServiceOpenTimeDto } from "./dto/AddServiceOpenTime.dto";
export declare class BServiceController {
    private bSService;
    constructor(bSService: BServiceService);
    upload(file: Express.Multer.File): void;
    modifyService(data: EnterPriseNewServiceDataDto, res: any, files: Array<Express.Multer.File>, idService: any): Observable<Response>;
    addServiceIntroduce(data: AddServiceIntroduceDto, idService: any, res: any): Observable<Response>;
    addServiceOpenTime(data: AddServiceOpenTimeDto, res: any, idService: any): Observable<Response>;
    deleteService(res: any, idService: any): Observable<Response>;
    getAllSchedule(res: any, idService: any): Observable<Response>;
}
