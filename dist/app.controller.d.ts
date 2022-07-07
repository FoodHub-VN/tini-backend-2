import { AppService } from './app.service';
import { Response } from "express";
import { AuthReqInterface } from './auth/interface/auth-req.interface';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(req: any): string;
    testPut(res: Response, req: AuthReqInterface): Response<any, Record<string, any>>;
    testDelete(res: Response): Response<any, Record<string, any>>;
}
