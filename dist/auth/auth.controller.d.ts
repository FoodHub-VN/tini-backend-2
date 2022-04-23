import { AuthService } from "./auth.service";
import { Response } from "express";
import { Observable } from "rxjs";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, res: Response): Observable<Response>;
    loginEnterprise(req: any, res: Response): Observable<any>;
    loginAdmin(req: any, res: Response): Observable<any>;
    testJwt(req: any, res: Response): Observable<Response>;
    checkTokenUser(res: Response): Observable<Response>;
}
