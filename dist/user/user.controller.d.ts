/// <reference types="multer" />
import { UserService } from "./user.service";
import { UserRegisterDto } from "./dto/register.dto";
import { Response } from "express";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request.interface";
import { UpdateProfileDto } from "./dto/update.dto";
import { UserPrincipal } from "../auth/interface/user-principal";
import { AddScheduleDto } from "./dto/add-schedule.dto";
import { DoneScheduleDto } from "./dto/done-schedule.dto";
import { AddFavoriteDto } from "./dto/add-favorite.dto";
import { RatingServiceDto } from "./dto/rating-service.dto";
import { LikeCommentDto } from "./dto/like-comment.dto";
import { DeleteCommentDto } from "./dto/delete-comment.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(data: UserRegisterDto, res: Response): Observable<Response<any, Record<string, any>>>;
    profile(req: AuthenticatedRequest<UserPrincipal>, res: Response): Observable<Response>;
    update(req: AuthenticatedRequest<UserPrincipal>, res: Response, body: UpdateProfileDto): Observable<Response>;
    addSchedule(data: AddScheduleDto, req: AuthenticatedRequest<UserPrincipal>, res: Response): Observable<Response>;
    unSchedule(data: any, res: Response): Observable<Response>;
    doneSchedule(data: DoneScheduleDto, req: AuthenticatedRequest<UserPrincipal>, res: Response): Observable<Response>;
    getAllSchedule(res: Response): Observable<Response<any, Record<string, any>>>;
    addServiceToFavorite(req: AuthenticatedRequest<UserPrincipal>, data: AddFavoriteDto, res: Response): Observable<Response>;
    removeServiceFromFavorite(req: AuthenticatedRequest<UserPrincipal>, data: AddFavoriteDto, res: Response): Observable<Response>;
    getFollowedService(res: Response): Observable<Response>;
    getHistorySchedule(res: Response): Observable<Response>;
    ratingService(res: Response, data: RatingServiceDto, files: Array<Express.Multer.File>): Observable<Response>;
    deleteRatingService(res: Response, data: DeleteCommentDto): Observable<Response>;
    likeComment(res: Response, data: LikeCommentDto): Observable<Response>;
    uploadImage(file: Express.Multer.File, res: Response): Observable<Response>;
    getNotifications(res: Response): Observable<Response>;
    readAllNoti(res: Response): Observable<Response>;
}
