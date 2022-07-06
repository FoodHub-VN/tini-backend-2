import { AppService } from './app.service';
import { Response } from "express";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    testPut(res: Response): Response<any, Record<string, any>>;
    testDelete(res: Response): Response<any, Record<string, any>>;
}
