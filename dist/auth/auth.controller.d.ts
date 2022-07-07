import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetTokenDto } from './dto/get-token.dto';
import { AuthReqInterface } from './interface/auth-req.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getToken(res: Response, data: GetTokenDto): Promise<Response<any, Record<string, any>>>;
    testToken(res: Response, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
}
