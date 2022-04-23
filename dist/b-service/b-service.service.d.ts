/// <reference types="multer" />
import { Service, ServiceModel } from "../database/model/service.model";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "../auth/interface/enterprise-principal";
import { EnterPriseNewServiceDataDto } from "../enterprise/dto/enterprise-new-service.dto";
import { Observable } from "rxjs";
import { IntroductionModel } from "../database/model/introduction.model";
import { AddServiceIntroduceDto } from "./dto/AddServiceIntroduce.dto";
import { AddServiceOpenTimeDto } from "./dto/AddServiceOpenTime.dto";
import { Schedule, ScheduleModel } from "../database/model/schedule";
import { CategoryModel } from "../database/model/category.model";
import { FileUploadService } from "../upload/upload.service";
import { Comment, CommentModel } from "../database/model/comment.model";
import { ScoreModel } from "../database/model/scores.model";
export declare class BServiceService {
    private serviceModel;
    private introductionModel;
    private req;
    private scheduleModel;
    private categoryModel;
    private commentModel;
    private scoreModel;
    private uploadService;
    constructor(serviceModel: ServiceModel, introductionModel: IntroductionModel, req: AuthenticatedRequest<EnterprisePrincipal>, scheduleModel: ScheduleModel, categoryModel: CategoryModel, commentModel: CommentModel, scoreModel: ScoreModel, uploadService: FileUploadService);
    createService(data: EnterPriseNewServiceDataDto, images: Array<Express.Multer.File> | undefined): Promise<Service>;
    modifyService(data: EnterPriseNewServiceDataDto, serviceId: string, images: Array<Express.Multer.File> | undefined): Promise<Service>;
    addServiceIntroduce(data: AddServiceIntroduceDto, serviceId: string): Observable<any>;
    addServiceOpenTime(data: AddServiceOpenTimeDto, serviceId: string): Observable<Service>;
    deleteService(serviceId: string): Observable<Service>;
    getAllSchedule(serviceId: string): Observable<Schedule[]>;
    getInfo(serviceId: string): Promise<Service>;
    getComment(serviceId: string): Promise<Comment[]>;
    getServiceScore(serviceId: string): Promise<Array<number>>;
}
