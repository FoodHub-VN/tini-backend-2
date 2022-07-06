import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getToken(res: Response, data: any): Response<any, Record<string, any>>;
}
