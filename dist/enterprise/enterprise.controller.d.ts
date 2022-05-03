/// <reference types="multer" />
import { EnterpriseService } from "./enterprise.service";
import { Observable } from "rxjs";
import { Response } from "express";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";
import { EnterPriseNewServiceDataDto } from "./dto/enterprise-new-service.dto";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { ReadNotiDto } from "./dto/read-noti.dto";
import { DeleteScheduleDto } from "./dto/delete-schedule.dto";
import { DoneScheduleDto } from "./dto/done-schedule.dto";
import { EnterpriseEditDto } from "./dto/enterprise-edit.dto";
import { PaymentDtoUrl } from "./dto/payment-url.dto";
import { ConfigService } from "@nestjs/config";
export declare class EnterpriseController {
    private enterpriseService;
    private configService;
    constructor(enterpriseService: EnterpriseService, req: AuthenticatedRequest<EnterprisePrincipal>, configService: ConfigService);
    register(data: EnterpriseRegisterDto, res: Response): Observable<Response<any, Record<string, any>>>;
    newService(data: EnterPriseNewServiceDataDto, res: Response, files: Array<Express.Multer.File>): Observable<Response>;
    getInfo(res: any): Observable<Response>;
    getAllService(res: Response): Observable<Response>;
    getNotifications(res: Response): Observable<Response>;
    readNoti(res: Response, data: ReadNotiDto): Observable<Response>;
    readAllNoti(res: Response): Observable<Response>;
    getSchedules(res: Response): Observable<Response>;
    deleteSchedule(res: Response, data: DeleteScheduleDto): Observable<Response>;
    doneSchedule(res: Response, data: DoneScheduleDto): Observable<Response>;
    uploadImage(file: Express.Multer.File, res: Response): Observable<Response>;
    updateProfile(res: Response, data: EnterpriseEditDto): Observable<Response>;
    getOverviewAnalysis(res: Response): Observable<Response>;
    getPaymentUrl(req: AuthenticatedRequest<EnterprisePrincipal>, ip: any, res: Response, data: PaymentDtoUrl): Observable<Response<any, Record<string, any>>>;
    confirmPayment(amount: number, transactionNo: string, responseCode: string, orderId: string, req: AuthenticatedRequest<EnterprisePrincipal>, res: Response): void;
    handleConfirmTransactionFromClient(res: Response, data: any): Promise<void>;
}
