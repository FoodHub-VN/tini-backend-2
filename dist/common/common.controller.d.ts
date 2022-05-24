import { Response } from "express";
import { Observable } from "rxjs";
import { CommonService } from "./common.service";
import { BServiceService } from "../b-service/b-service.service";
import { UserService } from "../user/user.service";
export declare class CommonController {
    private readonly commonService;
    private readonly bService;
    private readonly userService;
    constructor(commonService: CommonService, bService: BServiceService, userService: UserService);
    getCategory(res: Response): Observable<Response>;
    getServiceInfo(res: any, idService: any): Observable<Response>;
    getCommentService(res: Response, idService: any): Observable<Response>;
    getUserInfo(res: Response, userId: string): Observable<Response>;
    getServiceScore(res: Response, idService: any): Observable<Response>;
    getEnterpriseInfo(res: any, idEnterprise: any): Observable<any>;
}
