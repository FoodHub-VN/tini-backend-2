import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetTokenDto } from './dto/get-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getToken(res: Response, data: GetTokenDto): Promise<Response<any, Record<string, any>>>;
}
