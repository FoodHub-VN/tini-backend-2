/// <reference types="multer" />
import { User, UserModel } from "../database/model/user.model";
import { Observable } from "rxjs";
import { UserRegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update.dto";
import { Schedule, ScheduleModel } from "../database/model/schedule";
import { Service, ServiceModel } from "../database/model/service.model";
import { ScheduleHistory, ScheduleHistoryModel } from "../database/model/schedule-history.model";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UserPrincipal } from "../auth/interface/user-principal";
import { Comment, CommentModel } from "../database/model/comment.model";
import { FileUploadService } from "../upload/upload.service";
import { Notification, NotificationModel } from "../database/model/notification.model";
import { NotificationGateway } from "../notification/notification.gateway";
import { FileUploaded } from "../upload/interface/upload.interface";
import { ScoreModel } from "../database/model/scores.model";
import { EnterpriseService } from "../enterprise/enterprise.service";
export declare class UserService {
    private userModel;
    private scheduleModel;
    private serviceModel;
    private scheduleHistory;
    private req;
    private commentModel;
    private notiModel;
    private scoreModel;
    private uploadService;
    private notiSocket;
    private enterpriseService;
    constructor(userModel: UserModel, scheduleModel: ScheduleModel, serviceModel: ServiceModel, scheduleHistory: ScheduleHistoryModel, req: AuthenticatedRequest<UserPrincipal>, commentModel: CommentModel, notiModel: NotificationModel, scoreModel: ScoreModel, uploadService: FileUploadService, notiSocket: NotificationGateway, enterpriseService: EnterpriseService);
    findUserWithPassByName(username: string, lean?: boolean): Observable<User>;
    findUserByName(username: string, lean?: boolean): Observable<User>;
    findUserById(userId: string): Promise<User>;
    register(data: UserRegisterDto): Observable<User>;
    existByUsername(username: string): Observable<boolean>;
    existByMail(email: string): Observable<boolean>;
    updateProfile(username: string, data: UpdateProfileDto): Observable<User>;
    doneServiceSchedule(username: string, serviceId: string): Observable<Schedule>;
    addSchedule(username: string, serviceId: string, time: Date): Observable<Schedule>;
    removeSchedule(scheduleId: string): Promise<any>;
    getAllSchedule(): Observable<Schedule[]>;
    addToFavorite(serviceId: string): Observable<Service>;
    removeFavorite(serviceId: string): Promise<any>;
    getFollowedService(): Observable<Service[]>;
    getHistorySchedule(): Observable<ScheduleHistory[]>;
    ratingService(serviceId: string, score: number[], title: string, content: string, images: Array<Express.Multer.File> | undefined): Promise<Comment>;
    deleteRating(id: string): Promise<any>;
    likeComment(commentId: string): Observable<Comment>;
    uploadAvatar(file: Express.Multer.File): Observable<FileUploaded>;
    deleteAvatar(file: Express.Multer.File): Observable<boolean>;
    getAllNotifications(): Promise<Notification[]>;
    readAllNoti(): Promise<any>;
}
